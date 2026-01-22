import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ParsedPlayer {
  id: number;
  name: string;
  short_name?: string;
  overall_rating?: number;
  potential_rating?: number;
  position?: string;
  age?: number;
  team_id?: number;
  pace?: number;
  shooting?: number;
  passing?: number;
  dribbling?: number;
  defending?: number;
  physical?: number;
}

interface ParsedTeam {
  id: number;
  name: string;
  short_name?: string;
  overall_rating?: number;
  league_id?: number;
}

interface ParsedLeague {
  id: number;
  name: string;
  short_name?: string;
  country_code?: string;
}

interface ParseResult {
  players: ParsedPlayer[];
  teams: ParsedTeam[];
  leagues: ParsedLeague[];
  format: string;
  hint?: string;
}

/* ---------------------------
   Rich detection types
----------------------------*/

type FileKind =
  | "json"
  | "fbchunks"
  | "frostbite_container"
  | "legacy_db"
  | "compressed_binary"
  | "text"
  | "unknown_binary";

type SignatureHit = {
  name: string;
  offset: number;
  value?: string;
  strength: "strong" | "medium" | "weak";
};

type SampleMetrics = {
  offset: number;
  length: number;
  entropy: number;
  printableRatio: number;
  asciiPreview: string;
  hexPreview: string;
};

type DetectionResult = {
  kind: FileKind;
  format: string;
  confidence: number;
  signatures: SignatureHit[];
  metrics: {
    size: number;
    headerHex: string;
    headerAscii: string;
    printableRatio: number;
    entropy: number;
    looksCompressed: boolean;
    looksUtf8Text: boolean;
  };
  samples: SampleMetrics[];
  reasoning: string[];
  recommendedAction?: {
    title: string;
    steps: string[];
  };
};

/* ---------------------------
   Helpers
----------------------------*/

function bytesToHex(bytes: Uint8Array, maxBytes = 32): string {
  return Array.from(bytes.slice(0, maxBytes))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(" ");
}

function asciiPreview(bytes: Uint8Array, maxBytes = 64): string {
  const slice = bytes.slice(0, maxBytes);
  let out = "";
  for (const b of slice) out += b >= 32 && b <= 126 ? String.fromCharCode(b) : ".";
  return out;
}

function printableRatio(bytes: Uint8Array, maxBytes = 8192): number {
  const slice = bytes.slice(0, Math.min(bytes.length, maxBytes));
  if (slice.length === 0) return 0;
  let printable = 0;
  for (const b of slice) {
    if (b === 0x09 || b === 0x0a || b === 0x0d) printable++;
    else if (b >= 32 && b <= 126) printable++;
  }
  return printable / slice.length;
}

function estimateEntropy(bytes: Uint8Array, maxBytes = 16384): number {
  const slice = bytes.slice(0, Math.min(bytes.length, maxBytes));
  if (slice.length === 0) return 0;

  const freq = new Array<number>(256).fill(0);
  for (const b of slice) freq[b]++;

  let ent = 0;
  const n = slice.length;
  for (let i = 0; i < 256; i++) {
    const c = freq[i];
    if (!c) continue;
    const p = c / n;
    ent -= p * Math.log2(p);
  }
  return ent;
}

function startsWithAscii(bytes: Uint8Array, ascii: string): boolean {
  const enc = new TextEncoder().encode(ascii);
  if (bytes.length < enc.length) return false;
  for (let i = 0; i < enc.length; i++) if (bytes[i] !== enc[i]) return false;
  return true;
}

function looksLikeJson(bytes: Uint8Array, maxScan = 256): boolean {
  const limit = Math.min(bytes.length, maxScan);
  let i = 0;
  while (
    i < limit &&
    (bytes[i] === 0x20 || bytes[i] === 0x0a || bytes[i] === 0x0d || bytes[i] === 0x09)
  ) i++;
  return i < limit && (bytes[i] === 0x7b || bytes[i] === 0x5b);
}

function compressionSignature(bytes: Uint8Array): "gzip" | "zlib" | "zip" | null {
  if (bytes.length < 2) return null;
  if (bytes[0] === 0x1f && bytes[1] === 0x8b) return "gzip";
  if (bytes.length >= 4 && bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04) return "zip";
  if (bytes[0] === 0x78 && (bytes[1] === 0x01 || bytes[1] === 0x9c || bytes[1] === 0xda)) return "zlib";
  return null;
}

function sampleWindow(bytes: Uint8Array, offset: number, length = 1024): SampleMetrics {
  const start = Math.max(0, Math.min(offset, bytes.length));
  const end = Math.min(bytes.length, start + length);
  const slice = bytes.slice(start, end);
  return {
    offset: start,
    length: slice.length,
    entropy: estimateEntropy(slice, slice.length),
    printableRatio: printableRatio(slice, slice.length),
    asciiPreview: asciiPreview(slice, 48),
    hexPreview: bytesToHex(slice, 16),
  };
}

/* ---------------------------
   Rich detector
----------------------------*/

function detectFile(bytes: Uint8Array): DetectionResult {
  const size = bytes.length;
  const header = bytes.slice(0, Math.min(size, 256));

  const signatures: SignatureHit[] = [];
  const reasoning: string[] = [];

  const headerHex = bytesToHex(header, 32);
  const headerAscii = asciiPreview(header, 64);

  // JSON
  if (looksLikeJson(header)) {
    reasoning.push("First non-whitespace byte indicates JSON ('{' or '[').");
    return {
      kind: "json",
      format: "json",
      confidence: 0.98,
      signatures: [{ name: "JSON", offset: 0, strength: "strong" }],
      metrics: {
        size,
        headerHex,
        headerAscii,
        printableRatio: printableRatio(header, 512),
        entropy: estimateEntropy(header, 4096),
        looksCompressed: false,
        looksUtf8Text: true,
      },
      samples: [sampleWindow(bytes, 0, 1024)],
      reasoning,
      recommendedAction: { title: "Parse JSON", steps: ["Proceed with JSON parsing/import."] },
    };
  }

  // FBCHUNKS
  if (startsWithAscii(header, "FBCHUNKS")) {
    signatures.push({ name: "FBCHUNKS", offset: 0, value: "FBCHUNKS", strength: "strong" });
    reasoning.push("Matched FBCHUNKS magic header at offset 0 (Frostbite container).");

    return {
      kind: "fbchunks",
      format: "fbchunks",
      confidence: 0.99,
      signatures,
      metrics: {
        size,
        headerHex,
        headerAscii,
        printableRatio: printableRatio(header, 4096),
        entropy: estimateEntropy(header, 16384),
        looksCompressed: true,
        looksUtf8Text: false,
      },
      samples: [
        sampleWindow(bytes, 0, 2048),
        sampleWindow(bytes, Math.floor(size * 0.25), 1024),
        sampleWindow(bytes, Math.floor(size * 0.5), 1024),
      ],
      reasoning,
      recommendedAction: {
        title: "Export to JSON with FET",
        steps: [
          "Open the squad file in FIFA Editor Tool (FET).",
          "Export/Convert the squad to JSON.",
          "Upload the JSON export to import players/teams/leagues.",
        ],
      },
    };
  }

  // Metrics / heuristics
  const ent = estimateEntropy(header, 16384);
  const pr = printableRatio(header, 8192);
  const comp = compressionSignature(header);

  const looksCompressed = comp !== null || (ent > 7.3 && pr < 0.15);
  const looksText = pr > 0.85 && ent < 6.0;

  reasoning.push(`Header entropy ~${ent.toFixed(2)} (0..8).`);
  reasoning.push(`Header printable ratio ~${(pr * 100).toFixed(1)}%.`);

  if (comp) {
    signatures.push({ name: comp.toUpperCase(), offset: 0, strength: "medium" });
    reasoning.push(`Detected compression signature: ${comp}.`);
  }

  // Light "DB marker" heuristic (weak)
  const headerText = new TextDecoder("utf-8", { fatal: false }).decode(header);
  const dbIndex = headerText.indexOf("DB");
  if (dbIndex >= 0) {
    signatures.push({ name: "DB_MARKER", offset: dbIndex, strength: "weak" });
    reasoning.push("Found 'DB' marker in header text (weak signal; may be incidental).");
  }

  let kind: FileKind = "unknown_binary";
  let format = "unknown";
  let confidence = 0.35;

  if (looksCompressed) {
    kind = "compressed_binary";
    format = comp ?? "compressed";
    confidence = comp ? 0.75 : 0.6;
    reasoning.push("High entropy + low printable ratio suggests packed/compressed binary.");
  } else if (looksText) {
    kind = "text";
    format = "text";
    confidence = 0.7;
    reasoning.push("High printable ratio suggests a plain-text file (not JSON).");
  } else if (ent >= 6.4 && ent <= 7.6 && pr >= 0.10 && pr <= 0.55) {
    kind = "frostbite_container";
    format = "frostbite_like";
    confidence = 0.55;
    reasoning.push("Moderate entropy with some ASCII islands resembles a structured game container.");
  }

  const samples: SampleMetrics[] = [
    sampleWindow(bytes, 0, 2048),
    sampleWindow(bytes, Math.floor(size * 0.5), 1024),
    sampleWindow(bytes, Math.floor(size * 0.9), 1024),
  ];

  return {
    kind,
    format,
    confidence,
    signatures,
    metrics: {
      size,
      headerHex,
      headerAscii,
      printableRatio: pr,
      entropy: ent,
      looksCompressed,
      looksUtf8Text: looksText,
    },
    samples,
    reasoning,
    recommendedAction: {
      title: "Convert to JSON for import",
      steps: [
        "If this is a FIFA/FC squad file, open it in FIFA Editor Tool (FET).",
        "Export the data to JSON.",
        "Upload the JSON export for accurate parsing.",
      ],
    },
  };
}

/* ---------------------------
   FBCHUNKS parse stub
----------------------------*/

function parseFBChunks(data: Uint8Array): ParseResult {
  console.log("Detected FBCHUNKS format - Frostbite engine squad file");
  return {
    players: [],
    teams: [],
    leagues: [],
    format: "fbchunks",
    hint:
      "FBCHUNKS files (Frostbite engine format) contain compressed binary data that requires FIFA Editor Tool (FET) to properly decode. Please export your squad file to JSON format using FET for accurate data import.",
  };
}

/* ---------------------------
   Handler
----------------------------*/

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileData, fileName, importType } = await req.json();

    if (!fileData) {
      return new Response(JSON.stringify({ success: false, error: "No file data provided" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    console.log(`Processing file: ${fileName}, import type: ${importType}`);

    // Decode base64 → bytes
    const binaryString = atob(fileData);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);

    console.log(`Decoded ${bytes.length} bytes from base64`);

    // Rich detection
    const detection = detectFile(bytes);

    console.log(`Detected kind: ${detection.kind}, format: ${detection.format}, confidence: ${detection.confidence}`);
    console.log(`Header hex: ${detection.metrics.headerHex}`);
    console.log(`Header ascii: ${detection.metrics.headerAscii}`);
    console.log(`Reasoning: ${detection.reasoning.join(" | ")}`);

    // FBCHUNKS: return actionable guidance
    if (detection.kind === "fbchunks") {
      const result = parseFBChunks(bytes);

      return new Response(
        JSON.stringify({
          success: false,
          error: "Frostbite engine squad file detected (FBCHUNKS format)",
          hint: result.hint,
          kind: detection.kind,
          format: detection.format,
          confidence: detection.confidence,
          fileInfo: {
            size: detection.metrics.size,
            sizeFormatted: `${(detection.metrics.size / 1024 / 1024).toFixed(2)} MB`,
            headerHex: detection.metrics.headerHex,
            headerAscii: detection.metrics.headerAscii,
            entropy: detection.metrics.entropy,
            printableRatio: detection.metrics.printableRatio,
          },
          reasoning: detection.reasoning,
          nextSteps: detection.recommendedAction?.steps ?? [],
          developerInfo: {
            signatures: detection.signatures,
            samples: detection.samples,
          },
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 415,
        },
      );
    }

    // JSON: parse and return
    if (detection.kind === "json") {
      const text = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
      const json = JSON.parse(text);

      return new Response(JSON.stringify({ success: true, format: "json", data: json }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Other binaries: consistent guidance payload
    return new Response(
      JSON.stringify({
        success: false,
        error: "Unsupported file format",
        hint: "This file does not appear to be a JSON export. FIFA/FC squad files often use proprietary Frostbite binary formats.",
        kind: detection.kind,
        format: detection.format,
        confidence: detection.confidence,
        fileInfo: {
          size: detection.metrics.size,
          sizeFormatted: `${(detection.metrics.size / 1024 / 1024).toFixed(2)} MB`,
          headerHex: detection.metrics.headerHex,
          headerAscii: detection.metrics.headerAscii,
          entropy: detection.metrics.entropy,
          printableRatio: detection.metrics.printableRatio,
        },
        reasoning: detection.reasoning,
        nextSteps: detection.recommendedAction?.steps ?? [],
        developerInfo: {
          signatures: detection.signatures,
          samples: detection.samples,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 415,
      },
    );
  } catch (error) {
    console.error("Error processing squad file:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

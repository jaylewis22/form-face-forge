import { cn } from "@/lib/utils";

const formationOptions = [
  { value: "4-4-2", grid: [[1], [1,1,1,1], [1,1,1,1], [1,1]] },
  { value: "4-3-3", grid: [[1], [1,1,1,1], [1,1,1], [1,1,1]] },
  { value: "3-5-2", grid: [[1], [1,1,1], [1,1,1,1,1], [1,1]] },
];

interface FormationSelectorProps {
  selected: string;
  onChange: (formation: string) => void;
}

export function FormationSelector({ selected, onChange }: FormationSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">Quick Select</h3>
      <div className="grid grid-cols-1 gap-3">
        {formationOptions.map((formation) => (
          <button
            key={formation.value}
            onClick={() => onChange(formation.value)}
            className={cn(
              "glass p-4 rounded-lg transition-all duration-200",
              selected === formation.value 
                ? "border-primary bg-primary/10" 
                : "border-border hover:border-primary/50"
            )}
          >
            <div className="text-sm font-medium mb-2">{formation.value}</div>
            <div className="space-y-1">
              {formation.grid.map((row, i) => (
                <div key={i} className="flex justify-center gap-1">
                  {row.map((_, j) => (
                    <div
                      key={j}
                      className={cn(
                        "w-2 h-2 rounded-full",
                        selected === formation.value ? "bg-primary" : "bg-muted-foreground"
                      )}
                    />
                  ))}
                </div>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
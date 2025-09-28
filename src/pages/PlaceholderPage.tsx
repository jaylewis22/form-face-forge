import { AppLayout } from "@/components/Layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PlaceholderPageProps {
  title: string;
}

export default function PlaceholderPage({ title }: PlaceholderPageProps) {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-6 animate-fade-in">
          <h1 className="text-4xl font-bold">{title}</h1>
          <p className="text-xl text-muted-foreground">
            This feature is coming soon!
          </p>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
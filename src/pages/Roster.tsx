import { useState } from "react";
import { AppLayout } from "@/components/Layout/AppLayout";
import { FormationField } from "@/components/Formation/FormationField";
import { FormationSelector } from "@/components/Formation/FormationSelector";

export default function Roster() {
  const [formation, setFormation] = useState("4-4-2");

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold mb-2">Roster</h1>
          <p className="text-muted-foreground">Manage your team formation and lineup</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formation Field - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="glass rounded-xl p-6">
              <FormationField />
            </div>
          </div>

          {/* Formation Selector - Takes 1 column */}
          <div className="space-y-6">
            <div className="glass rounded-xl p-6">
              <FormationSelector selected={formation} onChange={setFormation} />
            </div>

            {/* Additional Info */}
            <div className="glass rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Formation Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Formation:</span>
                  <span className="font-medium">{formation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Players:</span>
                  <span className="font-medium">11</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Substitutes:</span>
                  <span className="font-medium">7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
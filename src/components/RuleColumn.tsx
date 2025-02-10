
import { Rule } from "../types/rules";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { useState } from "react";

interface RuleColumnProps {
  rules: Rule[];
  onEvaluate: (rule: Rule) => void;
  onDelete: (ruleId: string) => void;
  isEvaluating: boolean;
}

const RuleColumn = ({ rules, onEvaluate, onDelete, isEvaluating }: RuleColumnProps) => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(current =>
      current.includes(id)
        ? current.filter(item => item !== id)
        : [...current, id]
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Rules</h2>
      <div className="space-y-2">
        {rules.map((rule) => (
          <Card key={rule.id} className="p-3">
            <Collapsible open={openItems.includes(rule.id)}>
              <div className="flex items-center justify-between gap-2">
                <CollapsibleTrigger
                  onClick={() => toggleItem(rule.id)}
                  className="flex items-center gap-2 hover:text-gray-700 flex-grow text-left"
                >
                  {openItems.includes(rule.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <h3 className="font-medium text-gray-900">{rule.title}</h3>
                </CollapsibleTrigger>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => onEvaluate(rule)}
                    disabled={isEvaluating}
                    variant="outline"
                    className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                    size="sm"
                  >
                    {isEvaluating ? "Evaluating..." : "Evaluate"}
                  </Button>
                  <Button
                    onClick={() => onDelete(rule.id)}
                    variant="outline"
                    size="sm"
                    className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CollapsibleContent className="pt-2">
                <p className="text-sm text-gray-600 pl-6">{rule.details}</p>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
        {rules.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">No rules added yet</p>
        )}
      </div>
    </div>
  );
};

export default RuleColumn;

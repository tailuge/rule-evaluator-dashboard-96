import { Rule } from "../types/rules";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface RuleColumnProps {
  rules: Rule[];
  onEvaluate: (rule: Rule) => void;
  isEvaluating: boolean;
}

const RuleColumn = ({ rules, onEvaluate, isEvaluating }: RuleColumnProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Rules</h2>
      <div className="space-y-4">
        {rules.map((rule) => (
          <Card key={rule.id} className="p-4 space-y-3">
            <h3 className="font-medium text-gray-900">{rule.title}</h3>
            <p className="text-sm text-gray-600">{rule.details}</p>
            <Button
              onClick={() => onEvaluate(rule)}
              disabled={isEvaluating}
              variant="outline"
              className="w-full"
            >
              {isEvaluating ? "Evaluating..." : "Evaluate"}
            </Button>
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
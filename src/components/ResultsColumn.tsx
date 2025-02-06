import { RuleResult } from "../types/rules";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ResultsColumnProps {
  results: RuleResult[];
}

const ResultsColumn = ({ results }: ResultsColumnProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PASS":
        return "bg-green-50 border-green-200 text-green-700";
      case "FAIL":
        return "bg-red-50 border-red-200 text-red-700";
      case "NA":
        return "bg-gray-50 border-gray-200 text-gray-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Results</h2>
      <div className="space-y-4">
        {results.map((result, index) => (
          <Card
            key={index}
            className={cn(
              "p-4 space-y-2 border-2",
              getStatusColor(result.status)
            )}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-medium">{result.rule.title}</h3>
              <span className="px-2 py-1 rounded-full text-sm font-medium">
                {result.status}
              </span>
            </div>
            <p className="text-sm">{result.justification}</p>
          </Card>
        ))}
        {results.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">No evaluations yet</p>
        )}
      </div>
    </div>
  );
};

export default ResultsColumn;
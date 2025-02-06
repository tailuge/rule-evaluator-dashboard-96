import { useState, useEffect } from "react";
import { Rule, RuleResult } from "../types/rules";
import RuleColumn from "./RuleColumn";
import ResultsColumn from "./ResultsColumn";
import { evaluateRule } from "../utils/azure";
import { useToast } from "@/components/ui/use-toast";

interface RuleBoardProps {
  subject: string;
}

const RuleBoard = ({ subject }: RuleBoardProps) => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [results, setResults] = useState<RuleResult[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedRules = localStorage.getItem("rules");
    if (storedRules) {
      setRules(JSON.parse(storedRules));
    }

    const handleAddRule = (event: CustomEvent<Rule>) => {
      const newRules = [...rules, event.detail];
      saveRules(newRules);
    };

    const handleBulkImport = (event: CustomEvent<Rule[]>) => {
      saveRules(event.detail);
      setResults([]); // Clear results when importing new rules
    };

    window.addEventListener('addRule', handleAddRule as EventListener);
    window.addEventListener('bulkImportRules', handleBulkImport as EventListener);

    return () => {
      window.removeEventListener('addRule', handleAddRule as EventListener);
      window.removeEventListener('bulkImportRules', handleBulkImport as EventListener);
    };
  }, [rules]);

  const saveRules = (newRules: Rule[]) => {
    localStorage.setItem("rules", JSON.stringify(newRules));
    setRules(newRules);
  };

  const handleEvaluate = async (rule: Rule) => {
    if (!subject.trim()) {
      toast({
        title: "Error",
        description: "Please enter some subject matter to evaluate",
        variant: "destructive",
      });
      return;
    }

    setIsEvaluating(true);
    try {
      const result = await evaluateRule(rule, subject);
      setResults([...results, result]);
    } catch (error: any) {
      toast({
        title: "Evaluation Failed",
        description: error.message,
        variant: "destructive",
      });
      console.error("Evaluation failed:", error);
    }
    setIsEvaluating(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <RuleColumn rules={rules} onEvaluate={handleEvaluate} isEvaluating={isEvaluating} />
      <ResultsColumn results={results} />
    </div>
  );
};

export default RuleBoard;
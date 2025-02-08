
import { useState, useEffect } from "react";
import { Rule, RuleResult } from "../types/rules";
import RuleColumn from "./RuleColumn";
import ResultsColumn from "./ResultsColumn";
import { evaluateRule } from "../utils/azure";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";

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

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleEvaluateAll = async () => {
    if (!subject.trim()) {
      toast({
        title: "Error",
        description: "Please enter some subject matter to evaluate",
        variant: "destructive",
      });
      return;
    }

    setIsEvaluating(true);
    setResults([]); // Clear previous results

    try {
      for (const rule of rules) {
        try {
          const result = await evaluateRule(rule, subject);
          setResults(prev => [...prev, result]);
          await delay(10000); // Wait 10 seconds between evaluations
        } catch (error: any) {
          toast({
            title: `Failed to evaluate rule: ${rule.title}`,
            description: error.message,
            variant: "destructive",
          });
          console.error("Evaluation failed:", error);
          // Continue with next rule even if one fails
        }
      }
    } finally {
      setIsEvaluating(false);
      toast({
        title: "Evaluation Complete",
        description: "All rules have been evaluated",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={handleEvaluateAll}
          disabled={isEvaluating || rules.length === 0}
          className="flex items-center gap-2"
        >
          <PlayCircle className="h-4 w-4" />
          Evaluate All Rules
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RuleColumn rules={rules} onEvaluate={handleEvaluate} isEvaluating={isEvaluating} />
        <ResultsColumn results={results} />
      </div>
    </div>
  );
};

export default RuleBoard;

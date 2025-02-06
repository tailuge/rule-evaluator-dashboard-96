import { useState, useEffect } from "react";
import { Rule, RuleResult } from "../types/rules";
import RuleColumn from "./RuleColumn";
import ResultsColumn from "./ResultsColumn";
import AddRuleForm from "./AddRuleForm";
import { evaluateRule } from "../utils/azure";

interface RuleBoardProps {
  subject: string;
}

const RuleBoard = ({ subject }: RuleBoardProps) => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [results, setResults] = useState<RuleResult[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => {
    const storedRules = localStorage.getItem("rules");
    if (storedRules) {
      setRules(JSON.parse(storedRules));
    }
  }, []);

  const saveRules = (newRules: Rule[]) => {
    localStorage.setItem("rules", JSON.stringify(newRules));
    setRules(newRules);
  };

  const handleAddRule = (rule: Rule) => {
    const newRules = [...rules, rule];
    saveRules(newRules);
  };

  const handleEvaluate = async (rule: Rule) => {
    setIsEvaluating(true);
    try {
      const result = await evaluateRule(rule, subject);
      setResults([...results, result]);
    } catch (error) {
      console.error("Evaluation failed:", error);
    }
    setIsEvaluating(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <RuleColumn rules={rules} onEvaluate={handleEvaluate} isEvaluating={isEvaluating} />
      <AddRuleForm onAddRule={handleAddRule} />
      <ResultsColumn results={results} />
    </div>
  );
};

export default RuleBoard;
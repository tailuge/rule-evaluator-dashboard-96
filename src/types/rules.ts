export interface Rule {
  id: string;
  title: string;
  details: string;
}

export interface RuleResult {
  rule: Rule;
  status: "PASS" | "FAIL" | "NA";
  justification: string;
}
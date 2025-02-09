import axios from "axios";
import { Rule, RuleResult } from "../types/rules";

const AZURE_ENDPOINT = "https://models.inference.ai.azure.com/chat/completions";

const SYSTEM_PROMPT = `You are an expert in financial regulations and mortgage applications. 
Work from the perspective of the lender deciding if an application is a suitable risk profile for the company.
Given a mortgage application (provided as JSON) and a specific rule,
determine if the application complies with the rule, fails to comply, or if the rule is not applicable.
`;

export const evaluateRule = async (rule: Rule, subject: string): Promise<RuleResult> => {
  const apiKey = localStorage.getItem("azure_api_key");
  if (!apiKey?.trim()) {
    throw new Error("Please enter and save your Azure API key before evaluating rules");
  }

  const promtp = `
  Evaluate the following mortgage application against the provided rule. Use the outcomes below:

- **PASS**: if the application fully complies with the rule.
- **FAIL**: if the application does not comply with the rule.
- **NA**: if the rule does not apply to the application.
- **INSUFFICIENT DATA**: if the rule applies but essential information is missing to make a definitive determination.

Provide a single sentence justification for your decision. Format your response exactly as:

STATUS: [PASS/FAIL/NA/INSUFFICIENT DATA] | JUSTIFICATION: [Your brief explanation]

---

Rule Title:
${rule.title}

Rule Definition: 
${rule.details}


Mortgage Application Data:
${subject}
`;

  try {
    const response = await axios.post(
      AZURE_ENDPOINT,
      {
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt }
        ],
        model: "gpt-4o",
        temperature: 1,
        max_tokens: 4096,
        top_p: 1
      },
      {
        headers: {
          "Authorization": `Bearer ${apiKey.trim()}`,
          "Content-Type": "application/json"
        }
      }
    );

    const content = response.data.choices[0].message.content;
    const [statusPart, justificationPart] = content.split(" | ");
    const status = statusPart.split(": ")[1];
    const justification = justificationPart.split(": ")[1];

    return {
      rule,
      status: status as "PASS" | "FAIL" | "NA",
      justification
    };
  } catch (error: any) {
    console.error("Azure API call failed:", error);
    throw new Error(error.response?.data?.error?.message || "Failed to evaluate rule. Please check your API key and try again.");
  }
};

export const getCurrentModel = () => "gpt-4o";
export const getCurrentPrompt = () => SYSTEM_PROMPT;
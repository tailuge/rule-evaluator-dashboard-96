import axios from "axios";
import { Rule, RuleResult } from "../types/rules";

const AZURE_ENDPOINT = "https://models.inference.ai.azure.com/chat/completions";

export const evaluateRule = async (rule: Rule, subject: string): Promise<RuleResult> => {
  const apiKey = localStorage.getItem("azure_api_key");
  if (!apiKey) {
    throw new Error("API key not found");
  }

  const prompt = `
    Please evaluate the following subject matter against the given rule.
    Respond with either PASS, FAIL, or NA, followed by a brief justification.
    
    Rule: ${rule.title}
    Rule Details: ${rule.details}
    
    Subject Matter:
    ${subject}
    
    Format your response exactly as: STATUS: [PASS/FAIL/NA] | JUSTIFICATION: [Your brief explanation]
  `;

  try {
    const response = await axios.post(
      AZURE_ENDPOINT,
      {
        messages: [
          { role: "system", content: "You are a helpful assistant that evaluates text against rules." },
          { role: "user", content: prompt }
        ],
        model: "gpt-4o",
        temperature: 1,
        max_tokens: 4096,
        top_p: 1
      },
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
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
  } catch (error) {
    console.error("Azure API call failed:", error);
    throw new Error("Failed to evaluate rule");
  }
};
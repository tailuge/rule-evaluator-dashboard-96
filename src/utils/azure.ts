import axios from "axios";
import { Rule, RuleResult } from "../types/rules";

const AZURE_ENDPOINT = "https://models.inference.ai.azure.com/chat/completions";

const SYSTEM_PROMPT = "You are an expert in financial regulations and mortgage applications. Given the following data representing a mortgage application and the provided rule, determine if the application complies with, fails, or does not apply to the rule. Provide a single sentence justification and a PASS/FAIL/NA outcome";

export const evaluateRule = async (rule: Rule, subject: string): Promise<RuleResult> => {
  const apiKey = localStorage.getItem("azure_api_key");
  if (!apiKey?.trim()) {
    throw new Error("Please enter and save your Azure API key before evaluating rules");
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
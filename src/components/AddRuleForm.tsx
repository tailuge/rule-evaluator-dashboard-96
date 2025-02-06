import { useState } from "react";
import { Rule } from "../types/rules";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Upload } from "lucide-react";

interface AddRuleFormProps {
  onAddRule: (rule: Rule) => void;
  onBulkImport: (rules: Rule[]) => void;
}

const AddRuleForm = ({ onAddRule, onBulkImport }: AddRuleFormProps) => {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !details) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const newRule: Rule = {
      id: Date.now().toString(),
      title,
      details,
    };

    onAddRule(newRule);
    setTitle("");
    setDetails("");
    
    toast({
      title: "Rule Added",
      description: "Your new rule has been added successfully.",
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const rules = JSON.parse(text);

      if (!Array.isArray(rules)) {
        throw new Error("Invalid format: Expected an array of rules");
      }

      // Validate each rule has required properties
      rules.forEach((rule: any) => {
        if (!rule.title || !rule.details) {
          throw new Error("Invalid format: Each rule must have title and details");
        }
      });

      onBulkImport(rules);
      toast({
        title: "Success",
        description: `Imported ${rules.length} rules successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Import Failed",
        description: error.message,
        variant: "destructive",
      });
    }

    // Reset the file input
    e.target.value = "";
  };

  const sampleJson = JSON.stringify([
    { id: "1", title: "Example Rule", details: "Rule description here" }
  ], null, 2);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Add New Rule</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="rule-import"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("rule-import")?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Bulk Import
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent className="w-[300px]">
              <p className="font-medium mb-1">Expected JSON Format:</p>
              <pre className="text-xs bg-slate-100 p-2 rounded">
                {sampleJson}
              </pre>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter rule title"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Details</label>
          <Textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Enter rule details"
            className="min-h-[100px]"
          />
        </div>
        <Button type="submit" className="w-full">
          Add Rule
        </Button>
      </div>
    </form>
  );
};

export default AddRuleForm;
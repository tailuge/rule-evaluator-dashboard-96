import { useState } from "react";
import { Rule } from "../types/rules";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface AddRuleFormProps {
  onAddRule: (rule: Rule) => void;
}

const AddRuleForm = ({ onAddRule }: AddRuleFormProps) => {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Add New Rule</h2>
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
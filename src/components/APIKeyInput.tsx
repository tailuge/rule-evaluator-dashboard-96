import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export const APIKeyInput = () => {
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const storedKey = localStorage.getItem("azure_api_key");
    if (storedKey) setApiKey(storedKey);
  }, []);

  const handleSave = () => {
    localStorage.setItem("azure_api_key", apiKey);
    toast({
      title: "API Key Saved",
      description: "Your API key has been saved securely in local storage.",
    });
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Azure API Key</label>
      <div className="flex gap-2">
        <Input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your Azure API key"
          className="flex-1"
        />
        <Button onClick={handleSave} variant="outline">Save Key</Button>
      </div>
    </div>
  );
};
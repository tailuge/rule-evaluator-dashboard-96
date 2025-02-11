
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import JSONViewer from "./JSONViewer";

interface SubjectInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const SubjectInput = ({ value, onChange }: SubjectInputProps) => {
  const [parsedJSON, setParsedJSON] = useState<any | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (value.trim()) {
        const parsed = JSON.parse(value);
        setParsedJSON(parsed);
        setParseError(null);
      } else {
        setParsedJSON(null);
        setParseError(null);
      }
    } catch (e) {
      setParsedJSON(null);
      setParseError("Invalid JSON");
    }
  }, [value]);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Subject Matter</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter the subject matter to evaluate..."
            className="min-h-[150px]"
          />
          {parseError && (
            <p className="text-sm text-red-500">{parseError}</p>
          )}
        </div>
        {parsedJSON && (
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="text-sm font-medium text-gray-700 mb-2">JSON Preview</h3>
            <JSONViewer data={parsedJSON} />
          </div>
        )}
      </div>
    </div>
  );
};

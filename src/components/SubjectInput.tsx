import { Textarea } from "@/components/ui/textarea";

interface SubjectInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const SubjectInput = ({ value, onChange }: SubjectInputProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Subject Matter</label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter the subject matter to evaluate..."
        className="min-h-[150px]"
      />
    </div>
  );
};
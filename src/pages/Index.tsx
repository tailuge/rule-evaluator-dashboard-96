import { useState } from "react";
import RuleBoard from "../components/RuleBoard";
import { APIKeyInput } from "../components/APIKeyInput";
import { SubjectInput } from "../components/SubjectInput";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import AddRuleForm from "../components/AddRuleForm";
import { getCurrentModel, getCurrentPrompt } from "../utils/azure";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Index = () => {
  const [subject, setSubject] = useState("");
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900 text-center flex-grow">Rule Evaluation Board</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Settings</SheetTitle>
              </SheetHeader>
              <div className="space-y-6 mt-6">
                <APIKeyInput />
                <div className="space-y-4 border-t pt-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">Current Model</h3>
                    <p className="text-sm text-gray-600">{getCurrentModel()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">System Prompt</h3>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{getCurrentPrompt()}</p>
                  </div>
                </div>
                <div className="border-t pt-6">
                  <AddRuleForm 
                    onAddRule={(rule) => window.dispatchEvent(new CustomEvent('addRule', { detail: rule }))} 
                    onBulkImport={(rules) => window.dispatchEvent(new CustomEvent('bulkImportRules', { detail: rules }))} 
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <SubjectInput value={subject} onChange={setSubject} />
        </div>
        
        <RuleBoard subject={subject} />
      </div>
    </div>
  );
};

export default Index;
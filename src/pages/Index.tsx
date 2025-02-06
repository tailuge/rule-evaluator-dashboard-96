import { useState, useEffect } from "react";
import RuleBoard from "../components/RuleBoard";
import { APIKeyInput } from "../components/APIKeyInput";
import { SubjectInput } from "../components/SubjectInput";

const Index = () => {
  const [subject, setSubject] = useState("");
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-semibold text-gray-900">Rule Evaluation Board</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <APIKeyInput />
          <SubjectInput value={subject} onChange={setSubject} />
        </div>
        
        <RuleBoard subject={subject} />
      </div>
    </div>
  );
};

export default Index;
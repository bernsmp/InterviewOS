"use client";

import { useState } from "react";
import { DefinitionCascade } from "@/components/definition-cascade";
import { InterviewScriptView } from "@/components/interview-script-view";
import { InterviewExecution } from "@/components/interview-execution";
import { generateInterviewQuestions, natureDiscoveryQuestions } from "@/lib/question-generator";
import type { Requirement, InterviewScript } from "@/types/interview";

export default function InterviewPage() {
  const [step, setStep] = useState<"setup" | "script" | "execute">("setup");
  const [interviewScript, setInterviewScript] = useState<InterviewScript | null>(null);

  const handleSetupComplete = (jobDescription: string, requirements: Requirement[]) => {
    const questions = generateInterviewQuestions(requirements);
    
    const script: InterviewScript = {
      id: `script-${Date.now()}`,
      companyName: "Your Company", // This would come from a form
      positionTitle: "Position Title", // This would come from a form
      jobDescription,
      requirements,
      questions,
      natureDiscoveryQuestions,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setInterviewScript(script);
    setStep("script");
  };

  const handleStartInterview = () => {
    setStep("execute");
  };

  const handleInterviewComplete = () => {
    // Handle completed interview
    console.log("Interview completed");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">InterviewOS</h1>
        <p className="text-muted-foreground">
          Transform vague job requirements into measurable interview questions
        </p>
      </div>

      {step === "setup" && (
        <DefinitionCascade onComplete={handleSetupComplete} />
      )}

      {step === "script" && interviewScript && (
        <InterviewScriptView
          script={interviewScript}
          onStartInterview={handleStartInterview}
          onEdit={() => setStep("setup")}
        />
      )}

      {step === "execute" && interviewScript && (
        <InterviewExecution
          script={interviewScript}
          onComplete={handleInterviewComplete}
        />
      )}
    </div>
  );
}
"use client";

import { useState } from "react";
import { DefinitionCascade } from "@/components/definition-cascade";
import { InterviewScriptView } from "@/components/interview-script-view";
import { InterviewExecution } from "@/components/interview-execution";
import { InterviewSummary } from "@/components/interview-summary";
import { downloadInterviewResultsPDF } from "@/lib/interview-results-pdf";
import { generateInterviewQuestions, natureDiscoveryQuestions } from "@/lib/question-generator";
import type { Requirement, InterviewScript, InterviewResponse } from "@/types/interview";

export default function InterviewPage() {
  const [step, setStep] = useState<"setup" | "script" | "execute" | "complete">("setup");
  const [interviewScript, setInterviewScript] = useState<InterviewScript | null>(null);
  const [interviewResponses, setInterviewResponses] = useState<InterviewResponse[]>([]);

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

  const handleStartInterview = (filteredScript?: InterviewScript) => {
    if (filteredScript) {
      setInterviewScript(filteredScript);
    }
    setStep("execute");
  };

  const handleInterviewComplete = (responses: InterviewResponse[]) => {
    // Handle completed interview
    console.log("Interview completed with responses:", responses);
    setInterviewResponses(responses);
    setStep("complete");
  };

  const handleDownloadResults = () => {
    if (interviewScript) {
      downloadInterviewResultsPDF(interviewScript, interviewResponses);
    }
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
          onUpdateScript={setInterviewScript}
        />
      )}

      {step === "execute" && interviewScript && (
        <InterviewExecution
          script={interviewScript}
          onComplete={handleInterviewComplete}
          onBack={() => setStep("script")}
        />
      )}

      {step === "complete" && interviewScript && (
        <InterviewSummary
          script={interviewScript}
          responses={interviewResponses}
          onDownloadPDF={handleDownloadResults}
          onStartNew={() => setStep("setup")}
          onBackToQuestions={() => setStep("script")}
        />
      )}
    </div>
  );
}
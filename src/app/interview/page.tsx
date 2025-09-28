"use client";

import { useState } from "react";
import { DefinitionCascade } from "@/components/definition-cascade";
import { InterviewScriptView } from "@/components/interview-script-view";
import { InterviewExecution } from "@/components/interview-execution";
import { InterviewSummary } from "@/components/interview-summary";
import { downloadInterviewResultsPDF } from "@/lib/interview-results-pdf";
import { generateInterviewQuestions, natureDiscoveryQuestions } from "@/lib/question-generator";
import type { Requirement, InterviewScript, InterviewResponse } from "@/types/interview";
import Image from "next/image";

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
    <div className="min-h-screen bg-gradient-to-b from-[#F7FBFD] to-white">
      {/* Header */}
      <header className="border-b-2 border-[#E5E7EB] bg-white shadow-md">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image 
                src="/THD Logo.png" 
                alt="The Hiring Diagnostic" 
                width={300}
                height={60}
                className="h-12 w-auto"
                priority
              />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h2 className="text-lg md:text-xl lg:text-2xl text-[#4A5568] font-medium leading-relaxed">
            Transform vague job requirements into measurable interview questions
          </h2>
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
    </div>
  );
}
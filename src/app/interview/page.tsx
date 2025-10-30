"use client";

import { useState, useEffect } from "react";
import { DefinitionCascade } from "@/components/definition-cascade";
import { InterviewScriptView } from "@/components/interview-script-view";
import { InterviewExecution } from "@/components/interview-execution";
import { InterviewSummary } from "@/components/interview-summary";
import { downloadInterviewResultsPDF } from "@/lib/interview-results-pdf";
import { generateInterviewQuestions, natureDiscoveryQuestions } from "@/lib/question-generator";
import type { Requirement, InterviewScript, InterviewResponse } from "@/types/interview";
import { NavigationHeader } from "@/components/navigation-header";
import { useInterviewStorage } from "@/hooks/useLocalStorage";
import { Button } from "@/components/ui/button";
import { Save, RotateCcw, Check } from "lucide-react";

export default function InterviewPage() {
  const [step, setStep] = useState<"setup" | "script" | "execute" | "complete">("setup");
  const [interviewScript, setInterviewScript] = useState<InterviewScript | null>(null);
  const [interviewResponses, setInterviewResponses] = useState<InterviewResponse[]>([]);
  const [isRestoringSession, setIsRestoringSession] = useState(false);

  const {
    saveJobDescription,
    saveRequirements,
    saveClassifications,
    saveInterviewScript,
    saveInterviewResponse,
    saveInterviewComplete,
    restoreSession,
    clearSession,
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    saveNow,
  } = useInterviewStorage();

  // Restore session on mount
  useEffect(() => {
    const savedData = restoreSession();

    if (savedData && savedData.interviewScript) {
      setIsRestoringSession(true);

      // Restore interview script
      setInterviewScript(savedData.interviewScript);

      // Restore responses if any
      if (savedData.interviewResponses && savedData.interviewResponses.length > 0) {
        setInterviewResponses(savedData.interviewResponses);
      }

      // Determine and restore the appropriate step
      if (savedData.overallScore) {
        setStep("complete");
      } else if (savedData.interviewResponses && savedData.interviewResponses.length > 0) {
        setStep("execute");
      } else if (savedData.interviewScript) {
        setStep("script");
      }

      setIsRestoringSession(false);
    }
  }, []);

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

    // Save to local storage
    saveInterviewScript(script);
  };

  const handleStartInterview = (filteredScript?: InterviewScript) => {
    if (filteredScript) {
      setInterviewScript(filteredScript);
      // Save updated script with selected questions
      saveInterviewScript(filteredScript);
    }
    setStep("execute");
  };

  const handleInterviewComplete = (responses: InterviewResponse[]) => {
    // Handle completed interview
    console.log("Interview completed with responses:", responses);
    setInterviewResponses(responses);
    setStep("complete");

    // Save completed interview
    saveInterviewComplete(
      responses,
      undefined, // candidateName - will be added later if needed
      undefined, // candidateEmail - will be added later if needed
      undefined, // overallScore - calculated in summary
      undefined  // notes
    );
  };

  const handleDownloadResults = () => {
    if (interviewScript) {
      downloadInterviewResultsPDF(interviewScript, interviewResponses);
    }
  };

  const handleBack = () => {
    if (step === "execute") {
      setStep("script");
    } else if (step === "script") {
      setStep("setup");
    } else if (step === "complete") {
      setStep("execute");
    }
  };

  const getBackButtonText = () => {
    switch (step) {
      case "script":
        return "Back to Setup";
      case "execute":
        return "Back to Script";
      case "complete":
        return "Back to Interview";
      default:
        return "Back";
    }
  };

  const handleStartOver = () => {
    if (window.confirm("Are you sure you want to start over? This will clear your current progress.")) {
      clearSession();
      setStep("setup");
      setInterviewScript(null);
      setInterviewResponses([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7FBFD] to-white">
      <NavigationHeader
        backButtonText={getBackButtonText()}
        onBack={step !== "setup" ? handleBack : undefined}
        showBackButton={true}
      />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Progress saving indicator */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg md:text-xl lg:text-2xl text-[#4A5568] font-medium leading-relaxed">
              Transform vague job requirements into measurable interview questions
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Auto-save indicator */}
            {lastSaved && (
              <div className="text-sm text-gray-600 flex items-center gap-2">
                {isSaving ? (
                  <>
                    <Save className="h-4 w-4 animate-pulse" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Saved {lastSaved.toLocaleTimeString()}</span>
                  </>
                )}
              </div>
            )}

            {/* Start over button */}
            {step !== "setup" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleStartOver}
                className="text-gray-600"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Start Over
              </Button>
            )}
          </div>
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
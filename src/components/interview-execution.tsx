"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Save, ArrowLeft } from "lucide-react";
import { ConciseQuestionDisplay } from "@/components/concise-question-display";
import type { InterviewScript, InterviewResponse } from "@/types/interview";
import { useInterviewStorage } from "@/hooks/useLocalStorage";

interface InterviewExecutionProps {
  script: InterviewScript;
  onComplete: (responses: InterviewResponse[]) => void;
  onBack?: () => void;
}

export function InterviewExecution({ script, onComplete, onBack }: InterviewExecutionProps) {
  // Only use the questions that were passed in the script (already filtered)
  const allQuestions = script.questions;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, InterviewResponse>>({});

  // Local storage integration
  const { saveInterviewResponse, restoreSession } = useInterviewStorage();

  // Restore saved responses on mount
  useEffect(() => {
    const savedData = restoreSession();
    if (savedData) {
      // Restore responses if any
      if (savedData.interviewResponses && savedData.interviewResponses.length > 0) {
        const responseMap: Record<string, InterviewResponse> = {};
        savedData.interviewResponses.forEach(resp => {
          responseMap[resp.questionId] = resp;
        });
        setResponses(responseMap);
      }

      // Restore current question index
      if (savedData.currentQuestionIndex !== undefined) {
        setCurrentIndex(savedData.currentQuestionIndex);
      }
    }
  }, []);
  
  // Safety check
  if (allQuestions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Questions Selected</CardTitle>
          <CardDescription>Please go back and select at least one question.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Questions
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  const currentQuestion = allQuestions[currentIndex];
  const progress = ((currentIndex + 1) / allQuestions.length) * 100;
  
  const isNatureDiscovery = script.natureDiscoveryQuestions.some(
    q => q.id === currentQuestion.id
  );

  const handleScoreChange = (score: "pass" | "fail" | "maybe") => {
    const updatedResponses = {
      ...responses,
      [currentQuestion.id]: {
        ...responses[currentQuestion.id],
        questionId: currentQuestion.id,
        score,
        notes: responses[currentQuestion.id]?.notes || ""
      }
    };
    setResponses(updatedResponses);

    // Save to localStorage
    const allResponses = Object.values(updatedResponses);
    saveInterviewResponse(allResponses, currentIndex, allQuestions.length);
  };

  const handleNotesChange = (notes: string) => {
    const updatedResponses = {
      ...responses,
      [currentQuestion.id]: {
        ...responses[currentQuestion.id],
        questionId: currentQuestion.id,
        score: responses[currentQuestion.id]?.score || "maybe",
        notes
      }
    };
    setResponses(updatedResponses);

    // Save to localStorage (debounced automatically by the hook)
    const allResponses = Object.values(updatedResponses);
    saveInterviewResponse(allResponses, currentIndex, allQuestions.length);
  };

  const handleNext = () => {
    if (currentIndex < allQuestions.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);

      // Save current index to localStorage
      const allResponses = Object.values(responses);
      saveInterviewResponse(allResponses, newIndex, allQuestions.length);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);

      // Save current index to localStorage
      const allResponses = Object.values(responses);
      saveInterviewResponse(allResponses, newIndex, allQuestions.length);
    }
  };

  const handleComplete = () => {
    const allResponses = Object.values(responses);
    onComplete(allResponses);
  };

  const currentResponse = responses[currentQuestion.id];
  const requirement = script.requirements.find(
    r => r.id === ('requirementId' in currentQuestion ? currentQuestion.requirementId : undefined)
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {onBack && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onBack}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Questions
                  </Button>
                )}
                <CardTitle>Interview in Progress</CardTitle>
              </div>
              <Badge variant="outline">
                Question {currentIndex + 1} of {allQuestions.length}
              </Badge>
            </div>
            <Progress value={progress} />
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {isNatureDiscovery ? (
                <Badge variant="secondary">Nature Discovery</Badge>
              ) : requirement && (
                <Badge 
                  variant={
                    requirement.priority === "mandatory" ? "default" :
                    requirement.priority === "trainable" ? "secondary" : "outline"
                  }
                >
                  {requirement.priority}
                </Badge>
              )}
            </div>
            <CardTitle className="text-xl">Question {currentIndex + 1}</CardTitle>
            {requirement && (
              <CardDescription>
                Requirement: {requirement.text}
              </CardDescription>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <ConciseQuestionDisplay 
            question={currentQuestion}
            index={currentIndex + 1}
            requirementText={requirement?.text}
            className="p-4 bg-muted rounded-lg"
          />

          <div className="space-y-4">
            <Label htmlFor="score">Score</Label>
            <RadioGroup
              id="score"
              value={currentResponse?.score || "maybe"}
              onValueChange={handleScoreChange}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pass" id="pass" />
                <Label htmlFor="pass" className="cursor-pointer">
                  Pass - Strong answer with specific examples
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="maybe" id="maybe" />
                <Label htmlFor="maybe" className="cursor-pointer">
                  Maybe - Partial answer or potential
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fail" id="fail" />
                <Label htmlFor="fail" className="cursor-pointer">
                  Fail - Weak answer or red flags
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Record key points from their answer..."
              value={currentResponse?.notes || ""}
              onChange={(e) => handleNotesChange(e.target.value)}
              rows={6}
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            
            {currentIndex === allQuestions.length - 1 ? (
              <Button onClick={handleComplete}>
                <Save className="mr-2 h-4 w-4" />
                Complete Interview
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Progress Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Badge variant="default">
              Pass: {Object.values(responses).filter(r => r.score === "pass").length}
            </Badge>
            <Badge variant="secondary">
              Maybe: {Object.values(responses).filter(r => r.score === "maybe").length}
            </Badge>
            <Badge variant="destructive">
              Fail: {Object.values(responses).filter(r => r.score === "fail").length}
            </Badge>
            <Badge variant="outline">
              Unanswered: {allQuestions.length - Object.keys(responses).length}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import type { InterviewScript, InterviewResponse } from "@/types/interview";

interface InterviewSummaryProps {
  script: InterviewScript;
  responses: InterviewResponse[];
  candidateName?: string;
  onDownloadPDF: () => void;
  onStartNew: () => void;
  onBackToQuestions: () => void;
}

export function InterviewSummary({ 
  script, 
  responses, 
  candidateName = "Candidate",
  onDownloadPDF,
  onStartNew,
  onBackToQuestions
}: InterviewSummaryProps) {
  const passCount = responses.filter(r => r.score === "pass").length;
  const maybeCount = responses.filter(r => r.score === "maybe").length;
  const failCount = responses.filter(r => r.score === "fail").length;
  
  // Calculate pass rate
  const passRate = Math.round((passCount / responses.length) * 100);
  
  // Determine overall recommendation
  const getRecommendation = () => {
    if (passRate >= 80) return { text: "Strong Hire", color: "text-green-600" };
    if (passRate >= 60) return { text: "Potential Hire", color: "text-yellow-600" };
    if (passRate >= 40) return { text: "Borderline", color: "text-orange-600" };
    return { text: "Not Recommended", color: "text-red-600" };
  };
  
  const recommendation = getRecommendation();

  // Group responses with their questions
  const getQuestionById = (questionId: string) => {
    return script.questions.find(q => q.id === questionId) || 
           script.natureDiscoveryQuestions.find(q => q.id === questionId);
  };

  const getScoreIcon = (score: string) => {
    switch (score) {
      case "pass":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "maybe":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case "fail":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Interview Complete! 🎉</CardTitle>
              <CardDescription>
                Interview summary for {candidateName} • {new Date().toLocaleDateString()}
              </CardDescription>
            </div>
            <Button onClick={onDownloadPDF}>
              <Download className="mr-2 h-4 w-4" />
              Download Summary PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {/* Overall Results */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Overall Results</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted">
                  <p className="text-2xl font-bold">{responses.length}</p>
                  <p className="text-sm text-muted-foreground">Total Questions</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">{passCount}</p>
                  <p className="text-sm text-green-600 dark:text-green-400">Pass</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                  <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{maybeCount}</p>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">Maybe</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-red-100 dark:bg-red-900/20">
                  <p className="text-2xl font-bold text-red-700 dark:text-red-300">{failCount}</p>
                  <p className="text-sm text-red-600 dark:text-red-400">Fail</p>
                </div>
              </div>
            </div>

            {/* Recommendation */}
            <div className="p-6 rounded-lg bg-muted text-center">
              <p className="text-sm text-muted-foreground mb-2">Recommendation</p>
              <p className={`text-2xl font-bold ${recommendation.color}`}>
                {recommendation.text}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {passRate}% Pass Rate
              </p>
            </div>

            {/* Detailed Responses */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Detailed Responses</h3>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {responses.map((response, index) => {
                    const question = getQuestionById(response.questionId);
                    if (!question) return null;
                    
                    const requirement = 'requirementId' in question 
                      ? script.requirements.find(r => r.id === question.requirementId)
                      : null;

                    return (
                      <Card key={response.questionId}>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Question {index + 1}</span>
                                {getScoreIcon(response.score)}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {question.question}
                              </p>
                              {requirement && (
                                <Badge variant="outline" className="text-xs">
                                  {requirement.text}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        {response.notes && (
                          <CardContent>
                            <div className="space-y-2">
                              <p className="text-sm font-medium">Interview Notes:</p>
                              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                {response.notes}
                              </p>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>

          <div className="flex gap-2 pt-6">
            <Button onClick={onStartNew} variant="outline">
              Start New Interview
            </Button>
            <Button onClick={onBackToQuestions}>
              Back to Questions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
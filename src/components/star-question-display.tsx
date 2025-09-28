"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, MessageSquare, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { InterviewQuestion } from "@/types/interview";

/**
 * Properties for the STARQuestionDisplay component
 */
interface STARQuestionDisplayProps {
  question: InterviewQuestion;
  index: number;
  requirementText?: string;
}

/**
 * Displays interview questions in STAR format with collapsible follow-up questions
 * Provides visual indicators for STAR questions and expected behaviors
 */
export function STARQuestionDisplay({ question, index, requirementText }: STARQuestionDisplayProps) {
  const [showFollowUps, setShowFollowUps] = useState(false);
  
  if (!question.isSTAR) {
    // Return regular question display for non-STAR questions
    return (
      <div className="space-y-2">
        <p className="text-sm">
          <span className="font-medium text-muted-foreground mr-2">{index}.</span>
          {question.question}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4 border rounded-lg bg-card">
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <span className="font-medium text-muted-foreground">{index}.</span>
          <div className="flex-1">
            <Badge className="mb-2 bg-blue-100 text-blue-800">STAR Question</Badge>
            <p className="font-medium">{question.question}</p>
          </div>
        </div>
        
        {requirementText && (
          <div className="ml-6 text-xs text-muted-foreground">
            <Target className="inline h-3 w-3 mr-1" />
            Assesses: {requirementText}
          </div>
        )}
        
        {question.expectedBehavior && (
          <div className="ml-6 mt-2 p-2 bg-muted/50 rounded text-xs">
            <span className="font-medium">Look for:</span> {question.expectedBehavior}
          </div>
        )}
      </div>

      {question.followUps && question.followUps.length > 0 && (
        <div className="ml-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFollowUps(!showFollowUps)}
            className="text-xs h-7"
          >
            {showFollowUps ? (
              <ChevronDown className="h-3 w-3 mr-1" />
            ) : (
              <ChevronRight className="h-3 w-3 mr-1" />
            )}
            Follow-up Questions ({question.followUps.length})
          </Button>
          
          {showFollowUps && (
            <div className="mt-2 space-y-2 pl-4 border-l-2 border-muted">
              {question.followUps.map((followUp, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <MessageSquare className="h-3 w-3 text-muted-foreground mt-0.5" />
                  <p className="text-sm text-muted-foreground">{followUp}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
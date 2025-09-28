"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Target, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { InterviewQuestion } from "@/types/interview";

interface ConciseQuestionDisplayProps {
  question: InterviewQuestion;
  index: number;
  requirementText?: string;
  className?: string;
}

export function ConciseQuestionDisplay({ 
  question, 
  index, 
  requirementText,
  className 
}: ConciseQuestionDisplayProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Extract main question if it's too long
  const formatMainQuestion = (text: string): { main: string; hasMore: boolean } => {
    const sentences = text.match(/[^.!?]+[.!?]/g) || [text];
    const firstSentence = sentences[0]?.trim() || text;
    
    // If first sentence is reasonable length, use it
    if (firstSentence.length <= 150) {
      return { 
        main: firstSentence, 
        hasMore: sentences.length > 1 || text.length > firstSentence.length + 10 
      };
    }
    
    // Otherwise, truncate at word boundary
    const words = text.split(' ');
    const truncated = words.slice(0, 20).join(' ');
    return { 
      main: truncated + '...', 
      hasMore: true 
    };
  };

  const { main: mainQuestion, hasMore } = formatMainQuestion(question.question);
  const hasExtraContent = hasMore || question.followUps?.length || question.expectedBehavior;

  return (
    <div className={cn("space-y-3", className)}>
      {/* Main Question - Clean and Simple */}
      <div className="flex gap-3">
        <span className="font-medium text-muted-foreground mt-0.5">{index}.</span>
        <div className="flex-1 space-y-2">
          {question.isSTAR && (
            <Badge variant="secondary" className="text-xs">STAR</Badge>
          )}
          <p className="text-base font-medium leading-relaxed">
            {mainQuestion}
          </p>
          
          {/* Inline context if short */}
          {requirementText && requirementText.length < 50 && (
            <p className="text-xs text-muted-foreground">
              <Target className="inline h-3 w-3 mr-1" />
              Assessing: {requirementText}
            </p>
          )}
        </div>
      </div>

      {/* Expandable Details */}
      {hasExtraContent && (
        <div className="ml-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="h-auto py-1 px-2 text-xs"
          >
            {showDetails ? (
              <ChevronDown className="mr-1 h-3 w-3" />
            ) : (
              <ChevronRight className="mr-1 h-3 w-3" />
            )}
            {showDetails ? "Hide" : "Show"} details
          </Button>

          {showDetails && (
            <div className="mt-3 space-y-3 pl-4 border-l-2 border-muted">
              {/* Full question if truncated */}
              {hasMore && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Full question:</p>
                  <p className="text-sm">{question.question}</p>
                </div>
              )}

              {/* What to look for */}
              {question.expectedBehavior && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    <Lightbulb className="inline h-3 w-3 mr-1" />
                    Look for:
                  </p>
                  <p className="text-sm">{question.expectedBehavior}</p>
                </div>
              )}

              {/* Follow-ups */}
              {question.followUps && question.followUps.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Follow-up questions:</p>
                  <ul className="space-y-1">
                    {question.followUps.map((followUp, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        • {followUp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Long requirement context */}
              {requirementText && requirementText.length >= 50 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    <Target className="inline h-3 w-3 mr-1" />
                    Assessing:
                  </p>
                  <p className="text-sm text-muted-foreground">{requirementText}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
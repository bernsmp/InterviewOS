"use client";

import { AlertCircle, Check } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { validateQuestion } from "@/lib/smart-question-generator";
import type { InterviewQuestion } from "@/types/interview";

/**
 * Component properties for the QuestionValidator
 */
interface QuestionValidatorProps {
  questions: InterviewQuestion[];
}

/**
 * Validates interview questions to ensure they are open-ended and require specific examples
 * Displays validation results with suggestions for improvement
 */
export function QuestionValidator({ questions }: QuestionValidatorProps) {
  const validationResults = questions.map(q => ({
    question: q,
    isValid: validateQuestion(q.question),
    reason: !validateQuestion(q.question) ? getInvalidReason(q.question) : null
  }));

  const invalidQuestions = validationResults.filter(r => !r.isValid);
  const validCount = validationResults.filter(r => r.isValid).length;

  if (invalidQuestions.length === 0) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <Check className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">All Questions Valid</AlertTitle>
        <AlertDescription className="text-green-700">
          All {validCount} questions require specific examples and avoid yes/no patterns.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="bg-yellow-50 border-yellow-200">
      <AlertCircle className="h-4 w-4 text-yellow-600" />
      <AlertTitle className="text-yellow-800">Question Quality Check</AlertTitle>
      <AlertDescription className="text-yellow-700">
        <strong>{invalidQuestions.length} of {questions.length} questions</strong> may be too generic. 
        Consider rephrasing yes/no questions to require specific examples using the STAR format.
        {invalidQuestions.length <= 3 && (
          <ul className="mt-2 space-y-1 text-sm">
            {invalidQuestions.slice(0, 3).map((result, idx) => (
              <li key={idx} className="text-xs">
                • Question {questions.indexOf(result.question) + 1}: {result.reason}
              </li>
            ))}
          </ul>
        )}
      </AlertDescription>
    </Alert>
  );
}

/**
 * Determines why a question is invalid and provides improvement suggestions
 * @param question - The question text to analyze
 * @returns A string explaining why the question is invalid
 */
function getInvalidReason(question: string): string {
  // Check for yes/no patterns
  if (/^(do|did|can|could|would|will|are|were|have|has|is)\s+you\b/i.test(question)) {
    return "This is a yes/no question. Rephrase to require specific examples.";
  }
  
  if (/^(are|were)\s+you\s+(comfortable|familiar|experienced)\b/i.test(question)) {
    return "This allows a simple 'yes' answer. Ask for specific demonstrations of skill.";
  }
  
  return "This question doesn't require specific examples or stories.";
}
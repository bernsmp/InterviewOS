"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Toggle button component for expanding/collapsing question details
 * Includes proper ARIA labels and keyboard navigation support
 */
interface QuestionToggleButtonProps {
  questionId: string;
  hasDetails: boolean;
}

export function QuestionToggleButton({ questionId, hasDetails }: QuestionToggleButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  if (!hasDetails) return null;
  
  const handleToggle = async () => {
    setIsLoading(true);
    const detailsId = `details-${questionId}`;
    const details = document.getElementById(detailsId);
    
    // Small delay to show loading state (simulating content preparation)
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (details) {
      details.classList.toggle('hidden');
      setIsExpanded(!isExpanded);
      
      // Focus management for accessibility
      if (!isExpanded) {
        // When expanding, announce to screen readers
        details.setAttribute('aria-expanded', 'true');
      } else {
        details.setAttribute('aria-expanded', 'false');
      }
    }
    
    setIsLoading(false);
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };
  
  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-xs h-6 px-2"
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      aria-controls={`details-${questionId}`}
      aria-expanded={isExpanded}
      aria-label={isExpanded ? "Collapse question details" : "Expand question details"}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          Loading...
        </>
      ) : isExpanded ? (
        <>
          <ChevronUp className="h-3 w-3 mr-1" />
          Hide Details
        </>
      ) : (
        <>
          <ChevronDown className="h-3 w-3 mr-1" />
          Show Details
        </>
      )}
    </Button>
  );
}
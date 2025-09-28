"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface CollapsibleTextProps {
  brief: string;
  full?: string;
  className?: string;
  showLabel?: string;
  hideLabel?: string;
}

export function CollapsibleText({ 
  brief, 
  full, 
  className,
  showLabel = "Show more",
  hideLabel = "Show less"
}: CollapsibleTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // If there's no full text or it's the same as brief, don't show toggle
  if (!full || full === brief) {
    return <p className={className}>{brief}</p>;
  }

  return (
    <div className={cn("space-y-2", className)}>
      <p>{brief}</p>
      {isExpanded && (
        <div className="text-sm text-muted-foreground pl-4 border-l-2 border-muted">
          {full}
        </div>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
      >
        {isExpanded ? (
          <>
            <ChevronDown className="mr-1 h-3 w-3" />
            {hideLabel}
          </>
        ) : (
          <>
            <ChevronRight className="mr-1 h-3 w-3" />
            {showLabel}
          </>
        )}
      </Button>
    </div>
  );
}
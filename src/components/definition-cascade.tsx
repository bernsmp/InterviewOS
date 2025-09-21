"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ChevronRight } from "lucide-react";
import type { Requirement, RequirementPriority } from "@/types/interview";

interface DefinitionCascadeProps {
  onComplete: (jobDescription: string, requirements: Requirement[]) => void;
}

export function DefinitionCascade({ onComplete }: DefinitionCascadeProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [step, setStep] = useState<"input" | "extract" | "classify">("input");

  const extractRequirements = () => {
    // Enhanced extraction logic that parses individual requirements
    const requirements: string[] = [];
    
    // Split by newlines first
    const lines = jobDescription.split(/\n/).map(line => line.trim()).filter(Boolean);
    
    lines.forEach(line => {
      // Check if line contains multiple requirements separated by commas or semicolons
      if (line.includes(',') || line.includes(';') || line.includes(' and ')) {
        // Split by various delimiters
        const parts = line.split(/[,;]|(?:\sand\s)/);
        
        parts.forEach(part => {
          const cleaned = part.trim();
          if (cleaned && isLikelyRequirement(cleaned)) {
            requirements.push(cleanRequirementText(cleaned));
          }
        });
      } else if (isLikelyRequirement(line)) {
        // Single requirement on this line
        requirements.push(cleanRequirementText(line));
      }
    });
    
    // Also check for bulleted lists
    const bulletedText = jobDescription.split(/[•\-*◦▪︎▸→]/);
    bulletedText.forEach(text => {
      const cleaned = text.trim();
      if (cleaned && isLikelyRequirement(cleaned) && !requirements.includes(cleaned)) {
        // Split by commas if it contains multiple items
        if (cleaned.includes(',') || cleaned.includes(';')) {
          const parts = cleaned.split(/[,;]/);
          parts.forEach(part => {
            const subCleaned = cleanRequirementText(part.trim());
            if (subCleaned && !requirements.includes(subCleaned)) {
              requirements.push(subCleaned);
            }
          });
        } else {
          requirements.push(cleanRequirementText(cleaned));
        }
      }
    });
    
    // Remove duplicates and very short requirements
    const uniqueRequirements = [...new Set(requirements)]
      .filter(req => req.length > 5)
      .filter(req => !req.toLowerCase().includes('responsibilities include'))
      .filter(req => !req.toLowerCase().includes('we are looking for'));
    
    setRequirements(
      uniqueRequirements.map((text, index) => ({
        id: `req-${index}`,
        text,
        priority: "trainable" as RequirementPriority
      }))
    );
    setStep("extract");
  };
  
  const isLikelyRequirement = (text: string): boolean => {
    const lowercased = text.toLowerCase();
    const requirementKeywords = [
      "experience", "skill", "ability", "knowledge", "proficient",
      "understanding", "familiar", "expert", "degree", "certification",
      "years", "must", "should", "required", "preferred", "bonus",
      "strong", "excellent", "good", "solid", "proven", "track record",
      "background", "expertise", "competent", "qualified"
    ];
    
    // Check if it contains requirement keywords
    const hasKeyword = requirementKeywords.some(keyword => lowercased.includes(keyword));
    
    // Check for common patterns
    const hasYearsPattern = /\d+\+?\s*years?/i.test(text);
    const hasTechPattern = /\b(EMR|EHR|SQL|Python|Java|React|Angular|Vue|Node|AWS|Azure|GCP)\b/i.test(text);
    const hasEducationPattern = /\b(bachelor|master|degree|diploma|certification|certified)\b/i.test(text);
    
    return hasKeyword || hasYearsPattern || hasTechPattern || hasEducationPattern;
  };
  
  const cleanRequirementText = (text: string): string => {
    // Remove common prefixes
    const prefixes = [
      "must have", "should have", "required:", "preferred:",
      "minimum", "at least", "proven", "demonstrated",
      "must be", "should be", "needs to have", "looking for"
    ];
    
    let cleaned = text;
    prefixes.forEach(prefix => {
      const regex = new RegExp(`^${prefix}\\s*`, 'i');
      cleaned = cleaned.replace(regex, '');
    });
    
    // Remove trailing punctuation
    cleaned = cleaned.replace(/[.:;,]+$/, '');
    
    // Capitalize first letter
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    
    return cleaned.trim();
  };

  const updateRequirementPriority = (id: string, priority: RequirementPriority) => {
    setRequirements(prev =>
      prev.map(req =>
        req.id === id ? { ...req, priority } : req
      )
    );
  };

  const addRequirement = () => {
    const newRequirement: Requirement = {
      id: `req-${requirements.length}`,
      text: "",
      priority: "trainable"
    };
    setRequirements([...requirements, newRequirement]);
  };

  const updateRequirementText = (id: string, text: string) => {
    setRequirements(prev =>
      prev.map(req =>
        req.id === id ? { ...req, text } : req
      )
    );
  };

  const removeRequirement = (id: string) => {
    setRequirements(prev => prev.filter(req => req.id !== id));
  };

  const handleComplete = () => {
    const validRequirements = requirements.filter(req => req.text.trim());
    onComplete(jobDescription, validRequirements);
  };

  return (
    <div className="space-y-6">
      {step === "input" && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Job Description</CardTitle>
            <CardDescription>
              Paste the job description to extract requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="job-description">Job Description</Label>
              <Textarea
                id="job-description"
                placeholder="Paste the full job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={12}
              />
            </div>
            <Button 
              onClick={extractRequirements}
              disabled={!jobDescription.trim()}
            >
              Extract Requirements
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {step === "extract" && (
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Review Extracted Requirements</CardTitle>
            <CardDescription>
              Review and edit the extracted requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Review each requirement and add any that were missed. You can edit the text directly.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3">
              {requirements.map((req, index) => (
                <div key={req.id} className="flex gap-2 items-start">
                  <span className="text-sm text-muted-foreground mt-2">
                    {index + 1}.
                  </span>
                  <Textarea
                    value={req.text}
                    onChange={(e) => updateRequirementText(req.id, e.target.value)}
                    rows={2}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRequirement(req.id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={addRequirement}>
                Add Requirement
              </Button>
              <Button onClick={() => setStep("classify")}>
                Classify Requirements
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "classify" && (
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Classify Requirements</CardTitle>
            <CardDescription>
              Categorize each requirement by priority
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Mandatory:</strong> Core skills essential from day one<br />
                <strong>Trainable:</strong> Skills that can be taught in 1-3 months<br />
                <strong>Nice-to-have:</strong> Bonus skills that add value but aren&apos;t essential
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              {requirements.map((req) => (
                <div key={req.id} className="space-y-2 p-4 border rounded-lg">
                  <p className="text-sm">{req.text}</p>
                  <div className="flex gap-2">
                    <Button
                      variant={req.priority === "mandatory" ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateRequirementPriority(req.id, "mandatory")}
                    >
                      Mandatory
                    </Button>
                    <Button
                      variant={req.priority === "trainable" ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateRequirementPriority(req.id, "trainable")}
                    >
                      Trainable
                    </Button>
                    <Button
                      variant={req.priority === "nice-to-have" ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateRequirementPriority(req.id, "nice-to-have")}
                    >
                      Nice-to-have
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Badge variant="secondary">
                  {requirements.filter(r => r.priority === "mandatory").length} Mandatory
                </Badge>
                <Badge variant="secondary">
                  {requirements.filter(r => r.priority === "trainable").length} Trainable
                </Badge>
                <Badge variant="secondary">
                  {requirements.filter(r => r.priority === "nice-to-have").length} Nice-to-have
                </Badge>
              </div>
              <Button onClick={handleComplete}>
                Generate Interview Questions
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
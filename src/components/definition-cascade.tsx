"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ChevronRight, Loader2 } from "lucide-react";
import { RequirementDefinition } from "./requirement-definition";
import { RequirementClassificationV2 } from "./requirement-classification-v2";
import type { Requirement, RequirementPriority } from "@/types/interview";

interface DefinitionCascadeProps {
  onComplete: (jobDescription: string, requirements: Requirement[]) => void;
}

export function DefinitionCascade({ onComplete }: DefinitionCascadeProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [step, setStep] = useState<"input" | "extract" | "define" | "classify">("input");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionError, setExtractionError] = useState("");

  const extractRequirements = async () => {
    setIsExtracting(true);
    setExtractionError("");
    
    try {
      // Try Gemini API first
      const response = await fetch("/api/extract-requirements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobDescription }),
      });
      
      const data = await response.json();
      
      if (data.requirements && data.requirements.length > 0) {
        // Use Gemini's extracted requirements
        setRequirements(
          data.requirements.map((text: string, index: number) => ({
            id: `req-${index}`,
            text,
            priority: "trainable" as RequirementPriority
          }))
        );
      } else if (data.error) {
        // Fall back to local extraction if Gemini fails
        setExtractionError("AI extraction unavailable, using local extraction");
        extractRequirementsLocally();
      } else {
        // No requirements found
        setExtractionError("No requirements found in the job description");
      }
    } catch (error) {
      // Fall back to local extraction on network error
      console.error("API error:", error);
      setExtractionError("Using local extraction due to network error");
      extractRequirementsLocally();
    } finally {
      setIsExtracting(false);
      setStep("extract");
    }
  };

  const extractRequirementsLocally = () => {
    // Use existing smart extraction logic as fallback
    const rawRequirements: string[] = [];
    
    // Split by multiple delimiters to capture all potential requirements
    const allText = jobDescription
      .split(/[\n•\-*◦▪︎▸→]/)
      .join('\n')
      .split(/[,;]|\sand\s|\sor\s/)
      .map(text => text.trim())
      .filter(Boolean);
    
    // Extract potential requirements
    allText.forEach(text => {
      if (isLikelyRequirement(text)) {
        rawRequirements.push(text);
      }
    });
    
    // Smart processing: clean, normalize, and deduplicate
    const processedRequirements = smartProcessRequirements(rawRequirements);
    
    setRequirements(
      processedRequirements.map((text, index) => ({
        id: `req-${index}`,
        text,
        priority: "trainable" as RequirementPriority
      }))
    );
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
  
  const smartProcessRequirements = (rawRequirements: string[]): string[] => {
    // Step 1: Smart clean each requirement
    const cleanedRequirements = rawRequirements.map(req => smartCleanRequirement(req));
    
    // Step 2: Normalize and categorize
    const normalizedRequirements = cleanedRequirements.map(req => normalizeRequirement(req));
    
    // Step 3: Remove duplicates and similar requirements
    const deduplicatedRequirements = removeSimilarRequirements(normalizedRequirements);
    
    // Step 4: Final filtering and sorting
    return deduplicatedRequirements
      .filter(req => req.length >= 3)
      .filter(req => !isGenericPhrase(req))
      .slice(0, 15) // Limit to max 15 requirements
      .sort((a, b) => getPriorityScore(b) - getPriorityScore(a));
  };

  const smartCleanRequirement = (text: string): string => {
    let cleaned = text.trim();
    
    // Remove bullet points and numbering
    cleaned = cleaned.replace(/^[\d\w][\.\)]\s*/, '');
    cleaned = cleaned.replace(/^[•\-*◦▪︎▸→]\s*/, '');
    
    // Remove common prefixes more aggressively
    const prefixes = [
      "minimum of?", "at least", "must have", "should have", "required:", "preferred:",
      "minimum", "proven", "demonstrated", "must be", "should be", "needs? to have",
      "looking for", "candidate must", "candidate should", "ability to", "capable of",
      "experience with", "experience in", "knowledge of", "proficiency in", "skilled in",
      "strong", "excellent", "good", "solid", "outstanding", "superior"
    ];
    
    prefixes.forEach(prefix => {
      const regex = new RegExp(`^${prefix}\\s+`, 'i');
      cleaned = cleaned.replace(regex, '');
    });
    
    // Handle specific patterns
    cleaned = handleSpecificPatterns(cleaned);
    
    // Remove trailing punctuation and extra spaces
    cleaned = cleaned.replace(/[.:;,\(\)]+$/, '');
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    
    // Capitalize appropriately
    cleaned = capitalizeRequirement(cleaned);
    
    return cleaned;
  };

  const handleSpecificPatterns = (text: string): string => {
    let processed = text;
    
    // Handle years of experience patterns
    processed = processed.replace(/(\d+)\+?\s*years?\s+of\s+/i, '$1+ years ');
    processed = processed.replace(/(\d+)-(\d+)\s*years?\s+of\s+/i, '$1-$2 years ');
    
    // Handle certification patterns
    processed = processed.replace(/certification\s*\(([^)]+)\)/i, 'certification ($1)');
    processed = processed.replace(/certified\s+in\s+/i, '');
    
    // Handle proficiency patterns
    processed = processed.replace(/proficiency\s+(with|in)\s+/i, '');
    processed = processed.replace(/proficient\s+(with|in)\s+/i, '');
    
    // Handle communication patterns
    processed = processed.replace(/interpersonal\s+and\s+communication/i, 'communication');
    processed = processed.replace(/verbal\s+and\s+written\s+communication/i, 'communication');
    
    // Handle EMR/EHR patterns
    processed = processed.replace(/electronic\s+medical\s+records?\s*\(EMR\/EHR\s*systems?\)/i, 'EMR/EHR systems');
    processed = processed.replace(/EMR\/EHR\s+systems?\s+proficiency/i, 'EMR/EHR system proficiency');
    
    return processed;
  };

  const normalizeRequirement = (text: string): string => {
    // Create standardized versions of common requirements
    const normalized = text.toLowerCase();
    
    // Map similar requirements to standard forms
    const mappings: Record<string, string> = {
      'communication skills': 'Strong communication skills',
      'interpersonal skills': 'Strong communication skills',
      'verbal communication': 'Strong communication skills',
      'written communication': 'Strong communication skills',
      'emr experience': 'EMR/EHR system proficiency',
      'ehr experience': 'EMR/EHR system proficiency',
      'electronic medical records': 'EMR/EHR system proficiency',
      'medical office experience': 'Medical office experience',
      'customer service': 'Customer service skills',
      'multitasking': 'Multitasking abilities',
      'time management': 'Time management skills',
      'computer skills': 'Basic computer skills',
      'microsoft office': 'Microsoft Office proficiency',
      'detail oriented': 'Attention to detail',
      'organizational skills': 'Organization skills'
    };
    
    // Check for mappings
    for (const [key, value] of Object.entries(mappings)) {
      if (normalized.includes(key)) {
        return value;
      }
    }
    
    return text;
  };

  const removeSimilarRequirements = (requirements: string[]): string[] => {
    const unique: string[] = [];
    const seen = new Set<string>();
    
    requirements.forEach(req => {
      const normalized = req.toLowerCase()
        .replace(/skills?$/, '')
        .replace(/abilities$/, '')
        .replace(/experience$/, '')
        .trim();
      
      if (!seen.has(normalized)) {
        seen.add(normalized);
        unique.push(req);
      }
    });
    
    return unique;
  };

  const isGenericPhrase = (text: string): boolean => {
    const generic = [
      'high school', 'diploma', 'ged', 'responsibilities include',
      'we are looking for', 'the ideal candidate', 'job duties',
      'other duties', 'as assigned', 'equal opportunity'
    ];
    
    return generic.some(phrase => text.toLowerCase().includes(phrase));
  };

  const getPriorityScore = (text: string): number => {
    const lowercased = text.toLowerCase();
    let score = 0;
    
    // Higher score for specific technical skills
    if (lowercased.includes('emr') || lowercased.includes('ehr')) score += 10;
    if (lowercased.includes('certification')) score += 8;
    if (lowercased.includes('years')) score += 7;
    if (lowercased.includes('experience')) score += 5;
    if (lowercased.includes('communication')) score += 4;
    if (lowercased.includes('computer') || lowercased.includes('software')) score += 3;
    
    return score;
  };

  const capitalizeRequirement = (text: string): string => {
    // Handle special cases
    const specialCases: Record<string, string> = {
      'emr': 'EMR',
      'ehr': 'EHR',
      'cma': 'CMA',
      'rma': 'RMA',
      'cpr': 'CPR',
      'bls': 'BLS',
      'hipaa': 'HIPAA',
      'microsoft office': 'Microsoft Office',
      'excel': 'Excel',
      'word': 'Word',
      'powerpoint': 'PowerPoint'
    };
    
    let result = text;
    for (const [lower, proper] of Object.entries(specialCases)) {
      const regex = new RegExp(`\\b${lower}\\b`, 'gi');
      result = result.replace(regex, proper);
    }
    
    // Capitalize first letter
    return result.charAt(0).toUpperCase() + result.slice(1);
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
        <Card className="border-2 border-[#E5E7EB] shadow-xl rounded-3xl overflow-hidden bg-white">
          <div className="bg-gradient-to-r from-[#295B74] to-[#1e4358] text-white px-8 py-6">
            <CardTitle className="text-2xl font-bold" style={{ fontFamily: 'Work Sans, sans-serif' }}>
              Step 1: Job Description
            </CardTitle>
            <CardDescription className="text-[#CBE1EA] text-lg mt-2">
              Paste the job description to extract requirements
            </CardDescription>
          </div>
          <CardContent className="p-8 space-y-6 bg-gradient-to-b from-white to-[#F7FBFD]">
            <div className="space-y-3">
              <Label htmlFor="job-description" className="text-lg font-semibold text-[#295B74]" style={{ fontFamily: 'Work Sans, sans-serif' }}>
                Job Description
              </Label>
              <div className="relative">
                <Textarea
                  id="job-description"
                  placeholder="Paste the full job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={10}
                  className="border-2 border-[#CBE1EA] focus:border-[#6794A7] rounded-xl p-4 text-lg shadow-inner bg-white/80 backdrop-blur-sm placeholder:text-[#9CA3AF]"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                />
                <div className="absolute bottom-4 right-4 text-sm text-[#6794A7]">
                  {jobDescription.length > 0 && `${jobDescription.length} characters`}
                </div>
              </div>
            </div>
            <Button 
              onClick={extractRequirements}
              disabled={!jobDescription.trim() || isExtracting}
              className="w-full bg-gradient-to-r from-[#FC8A46] to-[#ff6b2b] hover:from-[#e87d3d] hover:to-[#ff5a1a] text-white font-bold text-lg py-6 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              style={{ fontFamily: 'Work Sans, sans-serif' }}
            >
              {isExtracting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Extracting with AI...
                </>
              ) : (
                <>
                  Extract Requirements
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
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
            {extractionError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{extractionError}</AlertDescription>
              </Alert>
            )}
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
              <Button onClick={() => setStep("define")}>
                Define Requirements
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "define" && (
        <RequirementDefinition
          requirements={requirements}
          onComplete={(definedRequirements) => {
            setRequirements(definedRequirements);
            setStep("classify");
          }}
          onBack={() => setStep("extract")}
        />
      )}

      {step === "classify" && (
        <RequirementClassificationV2
          requirements={requirements}
          onComplete={(classifiedRequirements) => {
            setRequirements(classifiedRequirements);
            handleComplete();
          }}
          onBack={() => setStep("define")}
        />
      )}
    </div>
  );
}
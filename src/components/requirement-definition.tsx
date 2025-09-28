import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { 
  ChevronRight, 
  AlertCircle, 
  CheckCircle, 
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp 
} from 'lucide-react';
import { detectVagueness, getVaguenessExplanation } from '@/lib/vagueness-detector';
import { categorizeRequirement } from '@/lib/ksao-framework';
import type { Requirement } from '@/types/interview';

interface RequirementWithDefinition extends Requirement {
  originalText: string;
  definedText?: string;
  isVague: boolean;
  vaguenessConfidence: number;
  ksaoCategory?: string;
  suggestions?: string[];
}

interface RequirementDefinitionProps {
  requirements: Requirement[];
  onComplete: (definedRequirements: Requirement[]) => void;
  onBack: () => void;
}

export function RequirementDefinition({ 
  requirements, 
  onComplete, 
  onBack 
}: RequirementDefinitionProps) {
  const [definedRequirements, setDefinedRequirements] = useState<RequirementWithDefinition[]>(
    requirements.map(req => {
      const analysis = detectVagueness(req.text);
      return {
        ...req,
        originalText: req.text,
        definedText: analysis.isVague ? '' : req.text,
        isVague: analysis.isVague,
        vaguenessConfidence: analysis.confidence,
        ksaoCategory: categorizeRequirement(req.text),
        suggestions: analysis.suggestions,
      };
    })
  );
  
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [isProcessingAI, setIsProcessingAI] = useState<string | null>(null);

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const updateDefinition = (id: string, definedText: string) => {
    setDefinedRequirements(prev => 
      prev.map(req => 
        req.id === id ? { ...req, definedText } : req
      )
    );
  };

  const getAISuggestion = async (requirement: RequirementWithDefinition) => {
    setIsProcessingAI(requirement.id);
    try {
      const response = await fetch("/api/define-requirement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          requirement: requirement.originalText,
          industry: detectIndustry(requirement.originalText)
        }),
      });
      
      const data = await response.json();
      
      if (data.definition) {
        updateDefinition(requirement.id, data.definition);
      } else if (data.error) {
        console.error("AI definition error:", data.error);
      }
    } catch (error) {
      console.error("Failed to get AI suggestion:", error);
    } finally {
      setIsProcessingAI(null);
    }
  };

  const detectIndustry = (text: string): string => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes("medical") || lowerText.includes("patient") || lowerText.includes("healthcare")) {
      return "medical";
    }
    if (lowerText.includes("code") || lowerText.includes("software") || lowerText.includes("programming")) {
      return "tech";
    }
    if (lowerText.includes("sales") || lowerText.includes("customer") || lowerText.includes("revenue")) {
      return "sales";
    }
    return "general";
  };

  const totalRequirements = definedRequirements.length;
  const definedCount = definedRequirements.filter(r => !r.isVague || r.definedText).length;
  const progress = (definedCount / totalRequirements) * 100;
  const canProceed = definedRequirements.every(r => !r.isVague || r.definedText);

  const handleComplete = () => {
    const finalRequirements = definedRequirements.map(req => ({
      ...req,
      text: req.definedText || req.text,
    }));
    onComplete(finalRequirements);
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Define Your Requirements</h2>
        <p className="text-muted-foreground">
          Let&apos;s make your requirements specific and measurable to generate better interview questions.
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Definition Progress</span>
          <span className="text-sm text-muted-foreground">
            {definedCount} of {totalRequirements} requirements defined
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="space-y-4">
        {definedRequirements.map((req) => (
          <Card 
            key={req.id} 
            className={req.isVague && !req.definedText ? 'border-orange-200' : 'border-green-200'}
          >
            <CardHeader 
              className="cursor-pointer"
              onClick={() => req.isVague && toggleExpanded(req.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {req.isVague && !req.definedText ? (
                      <AlertCircle className="h-5 w-5 text-orange-500" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    <CardTitle className="text-lg">
                      {req.originalText}
                    </CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      {req.ksaoCategory}
                    </Badge>
                    {req.isVague && (
                      <Badge className="bg-[#FC8A46] text-white hover:bg-[#e87d3d]">
                        Needs Definition
                      </Badge>
                    )}
                  </div>
                </div>
                {req.isVague && (
                  <Button variant="ghost" size="sm">
                    {expandedItems.has(req.id) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
            </CardHeader>

            {req.isVague && expandedItems.has(req.id) && (
              <CardContent className="space-y-4">
                <Alert>
                  <HelpCircle className="h-4 w-4" />
                  <AlertDescription>
                    {getVaguenessExplanation(req.originalText)}
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Define what &quot;{req.originalText}&quot; means in YOUR context:
                  </Label>
                  <Textarea
                    placeholder="Be specific: Include metrics, tools, frequency, and measurable outcomes..."
                    value={req.definedText}
                    onChange={(e) => updateDefinition(req.id, e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                {req.suggestions && req.suggestions.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Consider including:
                    </p>
                    <ul className="text-sm space-y-1 ml-4 list-disc">
                      {req.suggestions.map((suggestion, idx) => (
                        <li key={idx} className="text-muted-foreground">
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => getAISuggestion(req)}
                  disabled={isProcessingAI === req.id}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isProcessingAI === req.id ? 'Generating...' : 'Get AI Suggestion'}
                </Button>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={handleComplete}
          disabled={!canProceed}
        >
          Continue to Classification
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
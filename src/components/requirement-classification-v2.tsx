// components/requirement-classification-v2.tsx

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, AlertTriangle, ChevronRight, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CollapsibleText } from '@/components/ui/collapsible-text';
import { formatDefinitionForDisplay } from '@/lib/concise-prompts';
import type { Requirement } from '@/types/interview';

interface RequirementClassificationV2Props {
  requirements: Requirement[];
  onComplete: (classifiedRequirements: Requirement[]) => void;
  onBack: () => void;
}

export function RequirementClassificationV2({
  requirements: initialRequirements,
  onComplete,
  onBack
}: RequirementClassificationV2Props) {
  const [requirements, setRequirements] = useState<Requirement[]>(
    initialRequirements.map(req => ({
      ...req,
      isMandatory: req.isMandatory ?? undefined,
      isTrainable: req.isTrainable ?? undefined,
      willingToTrain: req.willingToTrain ?? undefined,
      finalClassification: req.finalClassification ?? undefined
    }))
  );

  const handleAnswerChange = (
    reqId: string,
    field: 'isMandatory' | 'isTrainable' | 'willingToTrain',
    value: boolean
  ) => {
    setRequirements(prev => {
      return prev.map(req => {
        if (req.id !== reqId) return req;

        const updated = { ...req, [field]: value };

        // Auto-calculate final classification based on new logic
        if (updated.isMandatory !== undefined) {
          // If must have on Day 1, classification is immediate
          if (updated.isMandatory === true) {
            updated.finalClassification = 'must-have';
          }
          // If not needed on Day 1, need to check trainability
          else if (updated.isTrainable !== undefined) {
            if (updated.isTrainable === false) {
              updated.finalClassification = 'nice-to-have';
            } else if (updated.willingToTrain !== undefined) {
              updated.finalClassification = updated.willingToTrain ? 'will-train' : 'nice-to-have';
            }
          }
        }

        return updated;
      });
    });
  };

  const isRequirementComplete = (req: Requirement): boolean => {
    if (req.isMandatory === undefined) return false;
    if (req.isMandatory === true) return true; // If must have on Day 1, we're done
    if (req.isTrainable === undefined) return false;
    if (req.isTrainable === false) return true; // If not trainable, we're done
    return req.willingToTrain !== undefined;
  };

  const canProceed = () => {
    return requirements.every(isRequirementComplete);
  };

  const getProgressPercentage = () => {
    const complete = requirements.filter(isRequirementComplete).length;
    return (complete / requirements.length) * 100;
  };

  const getClassificationColor = (classification: string | undefined) => {
    switch (classification) {
      case 'must-have':
        return 'bg-red-50 border-red-300 text-red-900';
      case 'will-train':
        return 'bg-yellow-50 border-yellow-300 text-yellow-900';
      case 'nice-to-have':
        return 'bg-green-50 border-green-300 text-green-900';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Classify Requirements</h2>
          <p className="text-gray-600 mt-2">
            Determine what&apos;s truly mandatory vs what you can train
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600 mb-1">Progress</div>
          <div className="w-32 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Day 1 = Must Have:</strong> Skills the candidate needs when they start.
          {' '}<strong>Will Train:</strong> Skills you&apos;ll teach to the right person.
          This helps you focus interviews on true Day 1 requirements.
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        {requirements.map((req) => (
          <Card 
            key={req.id}
            className={`transition-all ${
              req.finalClassification ? getClassificationColor(req.finalClassification) : ''
            }`}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="text-lg flex-1">{req.text}</CardTitle>
                {req.ksaoCategory && (
                  <Badge variant="secondary" className="text-xs">
                    {req.ksaoCategory}
                  </Badge>
                )}
              </div>
              {req.definition && (() => {
                const formatted = formatDefinitionForDisplay(req.definition);
                return (
                  <div className="mt-2">
                    <CollapsibleText
                      brief={formatted.brief}
                      full={req.definition !== formatted.brief ? req.definition : undefined}
                      className="text-sm text-muted-foreground"
                      showLabel="View full definition"
                      hideLabel="Hide definition"
                    />
                    {formatted.metrics && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {formatted.metrics.map((metric, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {metric}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
              {req.finalClassification && (
                <div className="mt-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                    ${req.finalClassification === 'must-have' ? 'bg-red-200 text-red-800' : ''}
                    ${req.finalClassification === 'will-train' ? 'bg-yellow-200 text-yellow-800' : ''}
                    ${req.finalClassification === 'nice-to-have' ? 'bg-green-200 text-green-800' : ''}
                  `}>
                    Final: {req.finalClassification === 'must-have' ? 'Must Have on Day 1' : 
                            req.finalClassification === 'will-train' ? 'Will Train' :
                            'Nice to Have'}
                  </span>
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Question 1: Must have on Day 1? */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label className="text-base font-medium">
                    1. Must the candidate already have this skill on Day 1?
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Does the candidate need to possess this skill when they start?</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <RadioGroup
                  value={req.isMandatory?.toString()}
                  onValueChange={(value) => handleAnswerChange(req.id, 'isMandatory', value === 'true')}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id={`${req.id}-mandatory-yes`} />
                    <Label htmlFor={`${req.id}-mandatory-yes`}>Yes, must have on Day 1</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id={`${req.id}-mandatory-no`} />
                    <Label htmlFor={`${req.id}-mandatory-no`}>No, not needed on Day 1</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Question 2: Can it be trained? (Only show if NOT needed on Day 1) */}
              {req.isMandatory === false && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label className="text-base font-medium">
                      2. Can this requirement be trained within 30-90 days?
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Could someone learn this skill quickly on the job?</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <RadioGroup
                    value={req.isTrainable?.toString()}
                    onValueChange={(value) => handleAnswerChange(req.id, 'isTrainable', value === 'true')}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id={`${req.id}-trainable-yes`} />
                      <Label htmlFor={`${req.id}-trainable-yes`}>Yes, can be trained</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id={`${req.id}-trainable-no`} />
                      <Label htmlFor={`${req.id}-trainable-no`}>No, cannot be easily trained</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {/* Question 3: Willing to train? (Only show if NOT needed Day 1 AND trainable) */}
              {req.isMandatory === false && req.isTrainable === true && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label className="text-base font-medium">
                      3. Are you willing to train this?
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Do you have time and resources to train someone on this?</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <RadioGroup
                    value={req.willingToTrain?.toString()}
                    onValueChange={(value) => handleAnswerChange(req.id, 'willingToTrain', value === 'true')}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id={`${req.id}-willing-yes`} />
                      <Label htmlFor={`${req.id}-willing-yes`}>Yes, we&apos;ll train the right person</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id={`${req.id}-willing-no`} />
                      <Label htmlFor={`${req.id}-willing-no`}>No, need someone who already has this</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {/* Show confirmation for will-train classification */}
              {req.isMandatory === false && req.isTrainable === true && req.willingToTrain === true && (
                <Alert className="bg-green-50 border-green-200">
                  <Info className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Great!</strong> This will be classified as &quot;will-train&quot; -
                    you&apos;ll generate interview questions to assess if candidates can learn this skill.
                  </AlertDescription>
                </Alert>
              )}

              {/* Show confirmation for must-have classification */}
              {req.isMandatory === true && (
                <Alert className="bg-red-50 border-red-200">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Must Have on Day 1:</strong> Candidates must already possess this skill.
                    Interview questions will assess their current proficiency.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <Button 
          onClick={onBack} 
          variant="outline"
        >
          Back
        </Button>
        <Button
          onClick={() => onComplete(requirements)}
          disabled={!canProceed()}
          className="flex items-center gap-2"
        >
          Continue to Question Generation
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
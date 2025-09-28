// components/requirement-classification-v2.tsx

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, AlertTriangle, ChevronRight, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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

  // Calculate final classification based on the three questions
  const calculateFinalClassification = (
    isMandatory: boolean,
    isTrainable: boolean,
    willingToTrain: boolean
  ): 'must-have' | 'nice-to-have' | 'will-train' => {
    if (!isMandatory) {
      return 'nice-to-have';
    }
    
    // It's mandatory - but is it REALLY mandatory?
    if (isTrainable && willingToTrain) {
      return 'will-train'; // Not actually mandatory if you'll train it!
    }
    
    return 'must-have'; // Truly mandatory - must have on day 1
  };

  const handleAnswerChange = (
    reqId: string,
    field: 'isMandatory' | 'isTrainable' | 'willingToTrain',
    value: boolean
  ) => {
    setRequirements(prev => {
      return prev.map(req => {
        if (req.id !== reqId) return req;
        
        const updated = { ...req, [field]: value };
        
        // Auto-calculate final classification if all questions answered
        if (
          updated.isMandatory !== undefined &&
          updated.isTrainable !== undefined &&
          (updated.isMandatory === false || updated.willingToTrain !== undefined)
        ) {
          updated.finalClassification = calculateFinalClassification(
            updated.isMandatory,
            updated.isTrainable ?? false,
            updated.willingToTrain ?? false
          );
        }
        
        return updated;
      });
    });
  };

  const isRequirementComplete = (req: Requirement): boolean => {
    if (req.isMandatory === undefined) return false;
    if (!req.isMandatory) return true; // If not mandatory, we're done
    if (req.isTrainable === undefined) return false;
    if (!req.isTrainable) return true; // If not trainable, we're done
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
          <strong>New approach:</strong> If something is mandatory BUT you&apos;re willing to train it, 
          then it&apos;s not actually mandatory! This helps you avoid rejecting great candidates 
          who could learn on the job.
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
              <CardTitle className="text-lg">{req.text}</CardTitle>
              {req.definition && (
                <CardDescription className="mt-2 italic">
                  Defined as: {req.definition}
                </CardDescription>
              )}
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
              {/* Question 1: Is it mandatory? */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label className="text-base font-medium">
                    1. Is this mandatory for job success?
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Would someone fail in this role without this requirement?</p>
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
                    <Label htmlFor={`${req.id}-mandatory-yes`}>Yes, absolutely required</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id={`${req.id}-mandatory-no`} />
                    <Label htmlFor={`${req.id}-mandatory-no`}>No, nice to have but not essential</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Question 2: Can it be trained? (Only show if mandatory) */}
              {req.isMandatory === true && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label className="text-base font-medium">
                      2. Can this requirement be trained/taught?
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Could someone learn this within 30-90 days on the job?</p>
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
                      <Label htmlFor={`${req.id}-trainable-no`}>No, must have on day 1</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {/* Question 3: Willing to train? (Only show if mandatory AND trainable) */}
              {req.isMandatory === true && req.isTrainable === true && (
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

              {/* Logic explanation */}
              {req.isMandatory === true && req.isTrainable === true && req.willingToTrain === true && (
                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    <strong>Important insight:</strong> Since you&apos;re willing to train this requirement, 
                    it&apos;s not truly mandatory! You can hire someone without it and train them.
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
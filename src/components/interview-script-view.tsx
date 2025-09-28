"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Play, Edit, Download, Sparkles, Settings, CheckSquare, Square, Info } from "lucide-react";
import { downloadInterviewPDF } from "@/lib/pdf-generator";
import { SortableQuestions } from "@/components/sortable-questions";
import type { InterviewScript } from "@/types/interview";

interface InterviewScriptViewProps {
  script: InterviewScript;
  onStartInterview: (filteredScript?: InterviewScript) => void;
  onEdit: () => void;
  onUpdateScript?: (script: InterviewScript) => void;
}

export function InterviewScriptView({ script, onStartInterview, onEdit, onUpdateScript }: InterviewScriptViewProps) {
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editedQuestion, setEditedQuestion] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCategorizing, setIsCategorizing] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(
    new Set([
      ...script.questions.map(q => q.id),
      ...script.natureDiscoveryQuestions.map(q => q.id)
    ])
  );
  // Count requirements based on new classification if available, otherwise use priority
  const mustHaveCount = script.requirements.filter(r => 
    r.finalClassification ? r.finalClassification === 'must-have' : r.priority === "mandatory"
  ).length;
  const willTrainCount = script.requirements.filter(r => 
    r.finalClassification ? r.finalClassification === 'will-train' : r.priority === "trainable"
  ).length;
  const niceToHaveCount = script.requirements.filter(r => 
    r.finalClassification ? r.finalClassification === 'nice-to-have' : r.priority === "nice-to-have"
  ).length;

  const handleEditQuestion = (questionId: string, currentText: string) => {
    setEditingQuestionId(questionId);
    setEditedQuestion(currentText);
  };

  const handleSaveQuestion = (questionId: string) => {
    if (onUpdateScript) {
      const updatedQuestions = script.questions.map(q => 
        q.id === questionId ? { ...q, question: editedQuestion } : q
      );
      onUpdateScript({ ...script, questions: updatedQuestions });
    }
    setEditingQuestionId(null);
    setEditedQuestion("");
  };

  const handleCancelEdit = () => {
    setEditingQuestionId(null);
    setEditedQuestion("");
  };

  const handleQuestionsReorder = (reorderedQuestions: unknown[]) => {
    if (onUpdateScript) {
      onUpdateScript({ ...script, questions: reorderedQuestions as typeof script.questions });
    }
  };

  const handleCategorizeQuestions = async () => {
    if (!onUpdateScript) return;
    
    setIsCategorizing(true);
    try {
      const response = await fetch('/api/categorize-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions: script.questions })
      });

      if (!response.ok) throw new Error('Failed to categorize');
      
      const { questions: categorizedQuestions } = await response.json();
      onUpdateScript({ ...script, questions: categorizedQuestions });
    } catch (error) {
      console.error('Failed to categorize questions:', error);
    } finally {
      setIsCategorizing(false);
    }
  };

  const handleToggleQuestion = (questionId: string) => {
    const newSelected = new Set(selectedQuestions);
    if (newSelected.has(questionId)) {
      newSelected.delete(questionId);
    } else {
      newSelected.add(questionId);
    }
    setSelectedQuestions(newSelected);
  };

  const handleSelectAll = () => {
    setSelectedQuestions(new Set([
      ...script.questions.map(q => q.id),
      ...script.natureDiscoveryQuestions.map(q => q.id)
    ]));
  };

  const handleDeselectAll = () => {
    setSelectedQuestions(new Set());
  };

  const handleStartInterviewWithSelected = () => {
    // Filter the script to only include selected questions
    const filteredQuestions = script.questions.filter(q => selectedQuestions.has(q.id));
    const filteredNatureQuestions = script.natureDiscoveryQuestions.filter(q => selectedQuestions.has(q.id));
    
    // Convert nature questions to the InterviewQuestion format
    const convertedNatureQuestions = filteredNatureQuestions.map(nq => ({
      ...nq,
      category: 'nature-discovery' as const,
      requirementId: undefined
    }));
    
    const filteredScript = {
      ...script,
      questions: [...filteredQuestions, ...convertedNatureQuestions],
      natureDiscoveryQuestions: [] // Empty since we've combined them above
    };
    onStartInterview(filteredScript);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Interview Script Ready</CardTitle>
                <CardDescription>
                  {script.questions.length + script.natureDiscoveryQuestions.length} questions • {selectedQuestions.size} selected
                </CardDescription>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" onClick={onEdit}>
                        <Edit className="mr-2 h-4 w-4" />
                        Requirements
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Go back to edit job requirements</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant={isEditMode ? "default" : "outline"}
                        size="sm"
                        onClick={() => setIsEditMode(!isEditMode)}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        {isEditMode ? "Done" : "Customize"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isEditMode ? "Exit customization mode" : "Edit questions, reorder, or use AI to categorize"}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => downloadInterviewPDF(script)}>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                  <Button 
                    onClick={handleStartInterviewWithSelected}
                    disabled={selectedQuestions.size === 0}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Start Interview
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Badge className="bg-red-500 text-white">{mustHaveCount} Must Have on Day 1</Badge>
            <Badge className="bg-yellow-500 text-white">{willTrainCount} Will Train</Badge>
            <Badge className="bg-green-500 text-white">{niceToHaveCount} Nice to Have</Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="requirements">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="questions">Interview Questions</TabsTrigger>
          <TabsTrigger value="nature">Nature Discovery</TabsTrigger>
        </TabsList>

        <TabsContent value="requirements" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Position Requirements</CardTitle>
              <CardDescription>
                Classified by priority level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Badge className="bg-red-500 text-white">Must Have on Day 1</Badge>
                    Requirements
                  </h4>
                  <ul className="space-y-2">
                    {script.requirements
                      .filter(r => r.finalClassification ? r.finalClassification === 'must-have' : r.priority === "mandatory")
                      .map(req => (
                        <li key={req.id} className="text-sm pl-4 border-l-2 border-red-500">
                          {req.text}
                          {req.definition && (
                            <span className="block text-gray-600 italic text-xs mt-1">
                              Defined as: {req.definition}
                            </span>
                          )}
                        </li>
                      ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Badge className="bg-yellow-500 text-white">Will Train</Badge>
                    Requirements
                  </h4>
                  <ul className="space-y-2">
                    {script.requirements
                      .filter(r => r.finalClassification ? r.finalClassification === 'will-train' : r.priority === "trainable")
                      .map(req => (
                        <li key={req.id} className="text-sm pl-4 border-l-2 border-yellow-500">
                          {req.text}
                          {req.definition && (
                            <span className="block text-gray-600 italic text-xs mt-1">
                              Defined as: {req.definition}
                            </span>
                          )}
                        </li>
                      ))}
                  </ul>
                </div>

                {script.requirements.filter(r => r.finalClassification ? r.finalClassification === 'nice-to-have' : r.priority === "nice-to-have").length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Badge className="bg-green-500 text-white">Nice to Have</Badge>
                      Requirements
                    </h4>
                    <ul className="space-y-2">
                      {script.requirements
                        .filter(r => r.finalClassification ? r.finalClassification === 'nice-to-have' : r.priority === "nice-to-have")
                        .map(req => (
                          <li key={req.id} className="text-sm pl-4 border-l-2 border-green-500">
                            {req.text}
                            {req.definition && (
                              <span className="block text-gray-600 italic text-xs mt-1">
                                Defined as: {req.definition}
                              </span>
                            )}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Interview Questions ({script.questions.length})</CardTitle>
                  <CardDescription>
                    Generated from requirements
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={selectedQuestions.size === (script.questions.length + script.natureDiscoveryQuestions.length) ? handleDeselectAll : handleSelectAll}
                  >
                    {selectedQuestions.size === (script.questions.length + script.natureDiscoveryQuestions.length) ? (
                      <>
                        <Square className="mr-2 h-4 w-4" />
                        Deselect All
                      </>
                    ) : (
                      <>
                        <CheckSquare className="mr-2 h-4 w-4" />
                        Select All
                      </>
                    )}
                  </Button>
                  {isEditMode && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCategorizeQuestions}
                      disabled={isCategorizing}
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      {isCategorizing ? "Categorizing..." : "AI Categorize & Order"}
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6 p-4 bg-muted/50 rounded-lg border">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm">Select Your Final Interview Questions</h4>
                    <p className="text-sm text-muted-foreground">
                      Check the questions you want to include in your interview. Uncheck any questions you want to skip. 
                      {!isEditMode && " Click 'Customize' to edit or reorder questions."}
                    </p>
                    {isEditMode && (
                      <p className="text-sm text-muted-foreground mt-2">
                        <span className="font-medium">Customize Mode:</span> Click the pencil icon to edit questions, 
                        drag the grip handles to reorder, or use &quot;AI Categorize &amp; Order&quot; to organize automatically.
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <ScrollArea className="h-[500px] pr-4">
                <SortableQuestions
                  questions={script.questions}
                  requirements={script.requirements}
                  isEditMode={isEditMode}
                  editingQuestionId={editingQuestionId}
                  editedQuestion={editedQuestion}
                  selectedQuestions={selectedQuestions}
                  onQuestionsReorder={handleQuestionsReorder}
                  onEditQuestion={handleEditQuestion}
                  onSaveQuestion={handleSaveQuestion}
                  onCancelEdit={handleCancelEdit}
                  onTextChange={setEditedQuestion}
                  onToggleQuestion={handleToggleQuestion}
                />
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nature" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Nature Discovery Questions</CardTitle>
              <CardDescription>
                Reveal what energizes vs exhausts the candidate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 p-4 bg-muted/50 rounded-lg border">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm">Psychological Assessment Questions</h4>
                    <p className="text-sm text-muted-foreground">
                      These questions reveal what naturally energizes vs exhausts candidates. 
                      They help identify if someone will thrive in your specific role and environment.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                {script.natureDiscoveryQuestions.map((question, index) => (
                  <div key={question.id} className="space-y-2">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedQuestions.has(question.id)}
                        onCheckedChange={() => handleToggleQuestion(question.id)}
                        className="mt-1"
                      />
                      <span className="text-sm font-medium text-muted-foreground">
                        {index + 1}.
                      </span>
                      <div className="flex-1 space-y-2">
                        <p className="font-medium">{question.question}</p>
                        <p className="text-sm text-muted-foreground">
                          Purpose: {question.purpose}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </TooltipProvider>
  );
}
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Play, Edit, Download, Pencil, Sparkles } from "lucide-react";
import { downloadInterviewPDF } from "@/lib/pdf-generator";
import { SortableQuestions } from "@/components/sortable-questions";
import type { InterviewScript, Question } from "@/types/interview";

interface InterviewScriptViewProps {
  script: InterviewScript;
  onStartInterview: () => void;
  onEdit: () => void;
  onUpdateScript?: (script: InterviewScript) => void;
}

export function InterviewScriptView({ script, onStartInterview, onEdit, onUpdateScript }: InterviewScriptViewProps) {
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editedQuestion, setEditedQuestion] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCategorizing, setIsCategorizing] = useState(false);
  const mandatoryCount = script.requirements.filter(r => r.priority === "mandatory").length;
  const trainableCount = script.requirements.filter(r => r.priority === "trainable").length;
  const niceToHaveCount = script.requirements.filter(r => r.priority === "nice-to-have").length;

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

  const handleQuestionsReorder = (reorderedQuestions: Question[]) => {
    if (onUpdateScript) {
      onUpdateScript({ ...script, questions: reorderedQuestions });
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Interview Script Ready</CardTitle>
              <CardDescription>
                {script.questions.length + script.natureDiscoveryQuestions.length} questions generated
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Requirements
              </Button>
              <Button 
                variant={isEditMode ? "default" : "outline"} 
                onClick={() => setIsEditMode(!isEditMode)}
              >
                <Pencil className="mr-2 h-4 w-4" />
                {isEditMode ? "Done Editing" : "Edit Questions"}
              </Button>
              <Button variant="outline" onClick={() => downloadInterviewPDF(script)}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button onClick={onStartInterview}>
                <Play className="mr-2 h-4 w-4" />
                Start Interview
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Badge variant="default">{mandatoryCount} Mandatory</Badge>
            <Badge variant="secondary">{trainableCount} Trainable</Badge>
            <Badge variant="outline">{niceToHaveCount} Nice-to-have</Badge>
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
                    <Badge variant="default">Mandatory</Badge>
                    Requirements
                  </h4>
                  <ul className="space-y-2">
                    {script.requirements
                      .filter(r => r.priority === "mandatory")
                      .map(req => (
                        <li key={req.id} className="text-sm pl-4 border-l-2 border-primary">
                          {req.text}
                        </li>
                      ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Badge variant="secondary">Trainable</Badge>
                    Requirements
                  </h4>
                  <ul className="space-y-2">
                    {script.requirements
                      .filter(r => r.priority === "trainable")
                      .map(req => (
                        <li key={req.id} className="text-sm pl-4 border-l-2 border-secondary">
                          {req.text}
                        </li>
                      ))}
                  </ul>
                </div>

                {script.requirements.filter(r => r.priority === "nice-to-have").length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Badge variant="outline">Nice-to-have</Badge>
                      Requirements
                    </h4>
                    <ul className="space-y-2">
                      {script.requirements
                        .filter(r => r.priority === "nice-to-have")
                        .map(req => (
                          <li key={req.id} className="text-sm pl-4 border-l-2 border-muted">
                            {req.text}
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
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <SortableQuestions
                  questions={script.questions}
                  requirements={script.requirements}
                  isEditMode={isEditMode}
                  editingQuestionId={editingQuestionId}
                  editedQuestion={editedQuestion}
                  onQuestionsReorder={handleQuestionsReorder}
                  onEditQuestion={handleEditQuestion}
                  onSaveQuestion={handleSaveQuestion}
                  onCancelEdit={handleCancelEdit}
                  onTextChange={setEditedQuestion}
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
              <div className="space-y-6">
                {script.natureDiscoveryQuestions.map((question, index) => (
                  <div key={question.id} className="space-y-2">
                    <div className="flex items-start gap-3">
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
  );
}
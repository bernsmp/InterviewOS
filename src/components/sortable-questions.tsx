"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { GripVertical, Pencil, Save, X } from "lucide-react";
import type { Question, Requirement, InterviewQuestion } from "@/types/interview";
import { QuestionToggleButton } from "./question-toggle-button";

type CategorizedQuestion = Question & {
  category?: string;
  subcategory?: string;
  importance?: number;
};

interface SortableItemProps {
  id: string;
  question: CategorizedQuestion;
  requirement?: Requirement;
  index: number;
  isEditMode: boolean;
  isEditing: boolean;
  editedText: string;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onSave: (id: string) => void;
  onCancel: () => void;
  onTextChange: (text: string) => void;
}

function SortableItem({ 
  id, 
  question, 
  requirement, 
  index, 
  isEditMode, 
  isEditing,
  editedText,
  isSelected,
  onToggleSelect,
  onEdit,
  onSave,
  onCancel,
  onTextChange
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="space-y-2 pb-4 border-b last:border-0"
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelect(question.id)}
          className="mt-1"
        />
        {isEditMode && (
          <div
            {...attributes}
            {...listeners}
            className="cursor-move touch-none"
          >
            <GripVertical className="h-5 w-5 text-muted-foreground mt-1" />
          </div>
        )}
        <span className="text-sm font-medium text-muted-foreground">
          {index + 1}.
        </span>
        <div className="flex-1 space-y-2">
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editedText}
                onChange={(e) => onTextChange(e.target.value)}
                className="text-sm min-h-[80px]"
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => onSave(question.id)}
                >
                  <Save className="mr-1 h-3 w-3" />
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onCancel}
                >
                  <X className="mr-1 h-3 w-3" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Show requirement title if available */}
              {requirement && (
                <div className="mb-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Assessing: {requirement.text}
                  </span>
                </div>
              )}
              
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm flex-1 font-medium">{question.question}</p>
                {isEditMode && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(question.id, question.question)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                )}
              </div>
              
              <div className="flex gap-2 flex-wrap items-center">
                {requirement && (
                  <Badge variant="outline" className="text-xs">
                    {requirement.finalClassification || requirement.priority}
                  </Badge>
                )}
                {'isSTAR' in question && question.isSTAR && (
                  <Badge className="bg-blue-100 text-blue-800 text-xs">STAR</Badge>
                )}
                {/* Add expand details button if there are details to show */}
                <QuestionToggleButton 
                  questionId={question.id}
                  hasDetails={
                    (('expectedBehavior' in question && !!question.expectedBehavior) || 
                    ('isSTAR' in question && question.isSTAR && 'followUps' in question && question.followUps && question.followUps.length > 0)) || false
                  }
                />
              </div>
              
              {/* Collapsible details section with ARIA attributes */}
              <div 
                id={`details-${question.id}`} 
                className="hidden space-y-2 mt-2"
                role="region"
                aria-labelledby={`toggle-${question.id}`}
              >
                {'expectedBehavior' in question && question.expectedBehavior && (
                  <div className="p-2 bg-muted/50 rounded text-xs">
                    <span className="font-medium">What to look for:</span> {question.expectedBehavior}
                  </div>
                )}
                {/* Show follow-up questions if this is a STAR question */}
                {'isSTAR' in question && question.isSTAR && 'followUps' in question && question.followUps && question.followUps.length > 0 && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs font-medium mb-2">Follow-up questions:</p>
                    <ul className="space-y-1">
                      {(question as InterviewQuestion).followUps?.map((followUp, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground ml-3">
                          • {followUp}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

interface SortableQuestionsProps {
  questions: unknown[];
  requirements: Requirement[];
  isEditMode: boolean;
  editingQuestionId: string | null;
  editedQuestion: string;
  selectedQuestions: Set<string>;
  onQuestionsReorder: (questions: unknown[]) => void;
  onEditQuestion: (id: string, text: string) => void;
  onSaveQuestion: (id: string) => void;
  onCancelEdit: () => void;
  onTextChange: (text: string) => void;
  onToggleQuestion: (id: string) => void;
}

export function SortableQuestions({
  questions,
  requirements,
  isEditMode,
  editingQuestionId,
  editedQuestion,
  selectedQuestions,
  onQuestionsReorder,
  onEditQuestion,
  onSaveQuestion,
  onCancelEdit,
  onTextChange,
  onToggleQuestion,
}: SortableQuestionsProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = questions.findIndex((q: unknown) => (q as { id: string }).id === active.id);
      const newIndex = questions.findIndex((q: unknown) => (q as { id: string }).id === over.id);
      
      const reorderedQuestions = arrayMove(questions, oldIndex, newIndex);
      onQuestionsReorder(reorderedQuestions);
    }
  };

  // Group questions by category
  const categorizedQuestions = questions as CategorizedQuestion[];
  let currentCategory = "";

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={questions.map((q: unknown) => (q as { id: string }).id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {categorizedQuestions.map((question, index) => {
            const requirement = 'requirementId' in question 
              ? requirements.find(r => r.id === (question as { requirementId?: string }).requirementId) 
              : undefined;
            const questionCategory = (question as unknown as Record<string, unknown>).category as string | undefined;
            const showCategoryHeader = questionCategory && questionCategory !== currentCategory;
            
            if (showCategoryHeader) {
              currentCategory = questionCategory;
            }

            return (
              <div key={question.id}>
                {showCategoryHeader && (
                  <div className="mb-4 mt-8 first:mt-0">
                    <h3 className="text-lg font-semibold text-primary">
                      {currentCategory}
                    </h3>
                    <div className="h-px bg-border mt-2" />
                  </div>
                )}
                <SortableItem
                  id={question.id}
                  question={question}
                  requirement={requirement}
                  index={index}
                  isEditMode={isEditMode}
                  isEditing={editingQuestionId === question.id}
                  editedText={editedQuestion}
                  isSelected={selectedQuestions.has(question.id)}
                  onToggleSelect={onToggleQuestion}
                  onEdit={onEditQuestion}
                  onSave={onSaveQuestion}
                  onCancel={onCancelEdit}
                  onTextChange={onTextChange}
                />
              </div>
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}
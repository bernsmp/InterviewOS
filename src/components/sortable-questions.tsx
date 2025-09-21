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
import type { Question, Requirement } from "@/types/interview";

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
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm flex-1">{question.question}</p>
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
          )}
          <div className="flex gap-2 flex-wrap">
            {requirement && (
              <Badge variant="outline" className="text-xs">
                {requirement.priority}
              </Badge>
            )}
            {question.category && (
              <Badge variant="secondary" className="text-xs">
                {question.category}
              </Badge>
            )}
            {question.subcategory && 
             question.subcategory !== "General" && 
             !question.subcategory.toLowerCase().includes("requirement") && (
              <Badge variant="outline" className="text-xs">
                {question.subcategory}
              </Badge>
            )}
          </div>
          {'expectedBehavior' in question && question.expectedBehavior && (
            <p className="text-xs text-muted-foreground">
              Expected: {question.expectedBehavior}
            </p>
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
import type { Requirement, InterviewQuestion, NatureDiscoveryQuestion } from "@/types/interview";
import { generateSmartQuestions } from "./smart-question-generator";

// Nature discovery questions - EXACT scripts
export const natureDiscoveryQuestions: NatureDiscoveryQuestion[] = [
  {
    id: "nature-1",
    question: "I want you to think back. I don't care where you were working, but think back to a day and it was like the worst day ever. I mean, it dragged on. It was miserable. By the time you got home that night, you didn't even have enough energy to lift the remote. Can you think of a day like that? What happened that day?",
    purpose: "Reveals what exhausts the candidate and potential mismatches"
  },
  {
    id: "nature-2",
    question: "Now think back to a day that flew by. You couldn't believe it was over. You had so much energy you could run a marathon. You have a day like that? What happened that day?",
    purpose: "Identifies what energizes the candidate and their ideal work environment"
  },
  {
    id: "nature-3",
    question: "If you could design your perfect role, what would your typical Tuesday look like from 9am to 5pm? Be specific about tasks, interactions, and environment.",
    purpose: "Uncovers intrinsic motivations and preferred work style"
  },
  {
    id: "nature-4",
    question: "Tell me about a time when you felt completely in your element at work - when everything just clicked. What were the conditions that made that possible?",
    purpose: "Identifies optimal performance conditions and natural strengths"
  }
];


function cleanRequirement(requirement: string): string {
  // Remove common prefixes and clean up the requirement text
  const prefixes = [
    "must have", "should have", "required:", "preferred:",
    "minimum", "at least", "strong", "excellent", "proven",
    "demonstrated", "experience with", "experience in",
    "ability to", "capable of", "proficient in", "skilled in"
  ];
  
  let cleaned = requirement.toLowerCase();
  prefixes.forEach(prefix => {
    if (cleaned.startsWith(prefix)) {
      cleaned = cleaned.substring(prefix.length);
    }
  });
  
  return cleaned.trim();
}

export function generateQuestionsForRequirement(requirement: Requirement): InterviewQuestion[] {
  const cleanedReq = cleanRequirement(requirement.text);
  const questions: InterviewQuestion[] = [];
  
  // Generate exactly 6 questions per requirement
  
  // 3 Factual/Historical Questions
  const factualQuestions = [
    `Tell me about your experience with ${cleanedReq}. What specific projects or roles have you used this in?`,
    `Describe a time when your ${cleanedReq} skills were critical to solving a problem. What was the situation and outcome?`,
    `Walk me through your most challenging experience involving ${cleanedReq}. How did you handle it and what did you learn?`
  ];
  
  factualQuestions.forEach((question, index) => {
    questions.push({
      id: `${requirement.id}-factual-${index + 1}`,
      question,
      requirementId: requirement.id,
      category: "requirement",
      expectedBehavior: "Specific examples with clear details about their experience"
    });
  });
  
  // 2 Scenario Questions
  const scenarioQuestions = [
    `Imagine you're assigned a project that requires advanced ${cleanedReq} skills but you're missing some knowledge. How would you approach this?`,
    `If a junior team member came to you struggling with ${cleanedReq}, how would you help them improve?`
  ];
  
  scenarioQuestions.forEach((question, index) => {
    questions.push({
      id: `${requirement.id}-scenario-${index + 1}`,
      question,
      requirementId: requirement.id,
      category: "requirement",
      expectedBehavior: "Demonstrates problem-solving approach and depth of understanding"
    });
  });
  
  // 1 "Three Examples" Question
  questions.push({
    id: `${requirement.id}-examples`,
    question: `Give me three specific examples of how you've applied ${cleanedReq} in your work. Please be specific about the context and impact.`,
    requirementId: requirement.id,
    category: "requirement",
    expectedBehavior: "Three distinct, concrete examples showing depth of experience"
  });
  
  return questions;
}


export function generateInterviewQuestions(requirements: Requirement[]): InterviewQuestion[] {
  const allQuestions: InterviewQuestion[] = [];
  
  // Filter requirements that should have questions generated
  // Only generate questions for must-have and will-train classifications
  const questionsToGenerate = requirements.filter(req => {
    // Use finalClassification if available (from new flow), otherwise fall back to priority
    if (req.finalClassification) {
      return req.finalClassification === 'must-have' || 
             req.finalClassification === 'will-train';
    }
    // Fallback for old flow
    return req.priority === 'mandatory' || req.priority === 'trainable';
  });
  
  // Sort requirements by classification/priority
  const sortedRequirements = [...questionsToGenerate].sort((a, b) => {
    // Prioritize must-have over will-train
    if (a.finalClassification && b.finalClassification) {
      const classificationOrder = { 'must-have': 0, 'will-train': 1, 'nice-to-have': 2 };
      return classificationOrder[a.finalClassification] - classificationOrder[b.finalClassification];
    }
    // Fallback to priority-based sorting
    const priorityOrder = { "mandatory": 0, "trainable": 1, "nice-to-have": 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
  
  // Generate smart questions for each requirement
  sortedRequirements.forEach(requirement => {
    // Always try to use smart question generator
    // It will handle requirements with or without definitions
    const smartQuestions = generateSmartQuestions(requirement);
    allQuestions.push(...smartQuestions);
  });
  
  return allQuestions;
}
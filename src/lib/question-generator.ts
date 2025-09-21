import type { Requirement, InterviewQuestion, NatureDiscoveryQuestion } from "@/types/interview";

// Question templates for different types of requirements
const questionTemplates = {
  experience: [
    "Tell me about a specific time when you {requirement}. What was the situation and outcome?",
    "Describe your most challenging experience with {requirement}. How did you handle it?",
    "Walk me through a project where you had to {requirement}. What was your approach?",
    "Give me an example of when your {requirement} skills made a significant impact.",
    "What's the most complex {requirement} challenge you've faced? How did you solve it?"
  ],
  skill: [
    "How would you rate your {requirement} skills from 1-10? Give me examples that justify your rating.",
    "Tell me about a time when you had to learn {requirement} quickly. What was your process?",
    "Describe a situation where your {requirement} expertise was critical to success.",
    "What's your approach to staying current with {requirement}?",
    "Give me three examples of how you've applied {requirement} in your work."
  ],
  knowledge: [
    "Explain {requirement} as if I'm a junior team member. What are the key concepts?",
    "How do you apply {requirement} in practical situations? Give specific examples.",
    "What common mistakes do people make with {requirement}? How do you avoid them?",
    "Describe a time when your understanding of {requirement} helped solve a problem.",
    "What resources do you use to deepen your {requirement} knowledge?"
  ],
  soft_skill: [
    "Give me an example of when you demonstrated strong {requirement}.",
    "Tell me about a time when {requirement} was challenged. How did you respond?",
    "How do you develop and maintain {requirement} in your daily work?",
    "Describe a situation where lack of {requirement} caused problems. What did you learn?",
    "What does {requirement} mean to you in a professional context? Give examples."
  ],
  general: [
    "Describe your experience with {requirement}.",
    "How have you demonstrated {requirement} in your previous roles?",
    "What's your approach to {requirement}?",
    "Tell me about a specific achievement related to {requirement}.",
    "How would your previous colleagues rate your {requirement}? Why?"
  ]
};

// Nature discovery questions - fixed set
export const natureDiscoveryQuestions: NatureDiscoveryQuestion[] = [
  {
    id: "nature-1",
    question: "Think about your best day at work in the last 6 months. Walk me through what made it great - what were you doing, who were you working with, what did you accomplish?",
    purpose: "Identifies what energizes the candidate and their ideal work environment"
  },
  {
    id: "nature-2",
    question: "Now think about a day that really drained you. What made it exhausting - was it the type of work, the people, the environment, or something else?",
    purpose: "Reveals what exhausts the candidate and potential mismatches"
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

function categorizeRequirement(requirement: string): keyof typeof questionTemplates {
  const text = requirement.toLowerCase();
  
  if (text.includes("experience") || text.includes("years")) {
    return "experience";
  } else if (
    text.includes("proficient") || 
    text.includes("skilled") || 
    text.includes("expertise") ||
    text.includes("ability")
  ) {
    return "skill";
  } else if (
    text.includes("knowledge") || 
    text.includes("understanding") || 
    text.includes("familiar")
  ) {
    return "knowledge";
  } else if (
    text.includes("communication") || 
    text.includes("leadership") || 
    text.includes("teamwork") ||
    text.includes("problem-solving") ||
    text.includes("collaboration")
  ) {
    return "soft_skill";
  }
  
  return "general";
}

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
  const category = categorizeRequirement(requirement.text);
  const templates = questionTemplates[category];
  const questions: InterviewQuestion[] = [];
  
  // Generate 3-5 questions per requirement based on priority
  const questionCount = requirement.priority === "mandatory" ? 5 : 
                       requirement.priority === "trainable" ? 4 : 3;
  
  // Use different templates and add variations
  for (let i = 0; i < questionCount && i < templates.length; i++) {
    const template = templates[i];
    const cleanedReq = cleanRequirement(requirement.text);
    
    const question = template.replace("{requirement}", cleanedReq);
    
    questions.push({
      id: `${requirement.id}-q${i + 1}`,
      question,
      requirementId: requirement.id,
      category: "requirement",
      expectedBehavior: getExpectedBehavior(requirement)
    });
  }
  
  // Add follow-up questions for mandatory requirements
  if (requirement.priority === "mandatory") {
    questions.push({
      id: `${requirement.id}-followup`,
      question: `On a scale of 1-10, how would you rate your current ${cleanRequirement(requirement.text)} abilities? What would it take to get to a 10?`,
      requirementId: requirement.id,
      category: "requirement",
      expectedBehavior: "Self-awareness of skill level and growth mindset"
    });
  }
  
  return questions;
}

function getExpectedBehavior(requirement: Requirement): string {
  const priority = requirement.priority;
  
  if (priority === "mandatory") {
    return "Demonstrates deep expertise with multiple specific examples";
  } else if (priority === "trainable") {
    return "Shows basic understanding and eagerness to learn";
  } else {
    return "Any relevant experience is a bonus";
  }
}

export function generateInterviewQuestions(requirements: Requirement[]): InterviewQuestion[] {
  const allQuestions: InterviewQuestion[] = [];
  
  // Sort requirements by priority
  const sortedRequirements = [...requirements].sort((a, b) => {
    const priorityOrder = { "mandatory": 0, "trainable": 1, "nice-to-have": 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
  
  // Generate questions for each requirement
  sortedRequirements.forEach(requirement => {
    const questions = generateQuestionsForRequirement(requirement);
    allQuestions.push(...questions);
  });
  
  // Ensure we have at least 40 questions
  if (allQuestions.length < 40) {
    // Add general behavioral questions
    const generalQuestions: InterviewQuestion[] = [
      {
        id: "general-1",
        question: "What interests you most about this role?",
        category: "requirement"
      },
      {
        id: "general-2",
        question: "Describe a time when you had to learn something completely new for your job.",
        category: "requirement"
      },
      {
        id: "general-3",
        question: "Tell me about your biggest professional achievement in the last year.",
        category: "requirement"
      },
      {
        id: "general-4",
        question: "How do you prioritize when everything seems urgent?",
        category: "requirement"
      },
      {
        id: "general-5",
        question: "Describe a time when you disagreed with your manager. How did you handle it?",
        category: "requirement"
      }
    ];
    
    const needed = 40 - allQuestions.length;
    allQuestions.push(...generalQuestions.slice(0, needed));
  }
  
  return allQuestions;
}
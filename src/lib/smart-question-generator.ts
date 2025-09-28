import type { Requirement, InterviewQuestion } from "@/types/interview";

/**
 * Smart question generator that creates KSAO-based interview questions
 * with STAR format and follow-up questions for comprehensive assessment
 */

// Simple memoization cache for generated questions
const questionCache = new Map<string, InterviewQuestion[]>();

interface QuestionTemplate {
  mainQuestion: string;
  followUps: string[];
  expectedBehaviors: string[];
}

interface KSAOTemplates {
  knowledge: QuestionTemplate[];
  skills: QuestionTemplate[];
  abilities: QuestionTemplate[];
  other: QuestionTemplate[];
}

const KSAO_TEMPLATES: KSAOTemplates = {
  knowledge: [
    {
      mainQuestion: "Explain your understanding of [REQUIREMENT]. What are the key factors that influence success in this area?",
      followUps: [
        "Can you give me a specific example of how you've applied this knowledge?",
        "What resources do you use to stay current in this area?",
        "How would you explain this concept to someone new to the field?"
      ],
      expectedBehaviors: [
        "Demonstrates deep understanding of concepts",
        "Provides concrete examples from experience",
        "Shows continuous learning mindset"
      ]
    },
    {
      mainQuestion: "Tell me about a time when your knowledge of [REQUIREMENT] was critical to solving a problem. Walk me through your thought process.",
      followUps: [
        "What was the outcome?",
        "What alternatives did you consider?",
        "How did you validate your solution?"
      ],
      expectedBehaviors: [
        "Shows practical application of knowledge",
        "Demonstrates analytical thinking",
        "Can articulate decision-making process"
      ]
    }
  ],
  
  skills: [
    {
      mainQuestion: "Walk me through your process for [REQUIREMENT]. Take me through a recent example step by step.",
      followUps: [
        "What challenges did you encounter?",
        "How long did each step take?",
        "What tools or resources did you use?",
        "How do you ensure quality in this process?"
      ],
      expectedBehaviors: [
        "Has a clear, systematic approach",
        "Can articulate specific steps",
        "Shows attention to detail and quality"
      ]
    },
    {
      mainQuestion: "Describe a situation where you had to [REQUIREMENT] under challenging circumstances. What made it challenging?",
      followUps: [
        "How did you adapt your usual approach?",
        "What was the result?",
        "What did you learn from this experience?",
        "How would you handle it differently today?"
      ],
      expectedBehaviors: [
        "Shows adaptability and problem-solving",
        "Can work under pressure",
        "Demonstrates learning from experience"
      ]
    },
    {
      mainQuestion: "If I asked you to [REQUIREMENT] right now, how would you approach it? What would be your first three steps?",
      followUps: [
        "What information would you need to gather first?",
        "How would you prioritize if you had multiple competing requests?",
        "How would you measure success?"
      ],
      expectedBehaviors: [
        "Can think on their feet",
        "Shows strategic planning ability",
        "Understands success metrics"
      ]
    }
  ],
  
  abilities: [
    {
      mainQuestion: "Tell me about a time when you successfully [REQUIREMENT]. What was the volume/scale involved?",
      followUps: [
        "How did you manage the workload?",
        "What systems or processes did you use?",
        "How did you maintain quality at that volume?",
        "What metrics did you track?"
      ],
      expectedBehaviors: [
        "Can handle specified volume/metrics",
        "Has systems for efficiency",
        "Tracks and measures performance"
      ]
    },
    {
      mainQuestion: "Describe your busiest day handling [REQUIREMENT]. Walk me through how you managed it.",
      followUps: [
        "What was your prioritization strategy?",
        "How did you handle competing deadlines?",
        "What was the outcome?",
        "How do you prevent burnout at high volumes?"
      ],
      expectedBehaviors: [
        "Can work at required pace",
        "Has stress management strategies",
        "Maintains performance under pressure"
      ]
    }
  ],
  
  other: [
    {
      mainQuestion: "What current certifications do you hold related to [REQUIREMENT]? When did you obtain them?",
      followUps: [
        "How do you maintain your certification?",
        "How has this certification helped in your work?"
      ],
      expectedBehaviors: [
        "Holds required certifications",
        "Maintains current status",
        "Applies certification knowledge"
      ]
    }
  ]
};

/**
 * Generates smart KSAO-based questions for a requirement
 * @param requirement - The requirement to generate questions for
 * @returns Array of interview questions with STAR format and follow-ups
 */
export function generateSmartQuestions(requirement: Requirement): InterviewQuestion[] {
  // Check cache first
  const cacheKey = `${requirement.id}-${requirement.ksaoCategory}-${requirement.definition || ''}`;
  if (questionCache.has(cacheKey)) {
    return questionCache.get(cacheKey)!;
  }
  
  try {
    const questions: InterviewQuestion[] = [];
    // Default to 'skills' if no KSAO category is set
    const category = requirement.ksaoCategory?.toLowerCase() || 'skills';
    
    // Get templates for this KSAO category
    const templates = KSAO_TEMPLATES[category as keyof KSAOTemplates] || KSAO_TEMPLATES.skills;
    
    // Select appropriate number of templates based on category
    const templateCount = category === 'other' ? 1 : 
                         category === 'knowledge' ? 2 : 
                         category === 'abilities' ? 2 : 3;
    
    // For requirements without definitions, use fewer questions
    const actualTemplateCount = requirement.definition ? templateCount : Math.min(templateCount, 2);
    const selectedTemplates = templates.slice(0, actualTemplateCount);
    
    // Generate questions from templates
    selectedTemplates.forEach((template, index) => {
      // Inject requirement text and definition into question
      const mainQuestion = injectContext(template.mainQuestion, requirement);
      
      // Create main question
      questions.push({
        id: `${requirement.id}-smart-${index}`,
        question: mainQuestion,
        requirementId: requirement.id,
        category: 'requirement',
        expectedBehavior: template.expectedBehaviors.join('; '),
        isSTAR: true,
        followUps: template.followUps.map(fu => injectContext(fu, requirement))
      });
    });
    
    // Add a metric-specific question if definition includes numbers
    if (requirement.definition && containsMetrics(requirement.definition)) {
      questions.push(generateMetricQuestion(requirement));
    }
    
    // Cache the generated questions
    questionCache.set(cacheKey, questions);
    
    return questions;
  } catch {
    // Silently fall back to basic questions
    return generateBasicQuestionsWithSTAR(requirement);
  }
}

/**
 * Fallback function that generates basic questions with STAR format
 * @param requirement - The requirement to generate questions for
 * @returns Array of basic interview questions
 */
function generateBasicQuestionsWithSTAR(requirement: Requirement): InterviewQuestion[] {
  const cleanedReq = requirement.text.toLowerCase()
    .replace(/^(must have|should have|required:|preferred:|ability to|capable of)/i, '')
    .trim();
    
  return [
    {
      id: `${requirement.id}-fallback-1`,
      question: `Tell me about your experience with ${cleanedReq}. Walk me through a specific example.`,
      requirementId: requirement.id,
      category: 'requirement',
      expectedBehavior: 'Demonstrates relevant experience with specific examples',
      isSTAR: true,
      followUps: [
        "What was the situation?",
        "What actions did you take?",
        "What was the outcome?"
      ]
    },
    {
      id: `${requirement.id}-fallback-2`,
      question: `Describe a challenging situation involving ${cleanedReq}. How did you handle it?`,
      requirementId: requirement.id,
      category: 'requirement',
      expectedBehavior: 'Shows problem-solving ability and resilience',
      isSTAR: true,
      followUps: [
        "What made it challenging?",
        "What alternatives did you consider?",
        "What did you learn from this experience?"
      ]
    }
  ];
}

function injectContext(template: string, requirement: Requirement): string {
  // Just use the requirement text, not the entire definition
  let question = template.replace(/\[REQUIREMENT\]/g, requirement.text.toLowerCase());

  // If we have metrics, add them briefly
  if (requirement.definition && containsMetrics(requirement.definition)) {
    const metrics = extractMetrics(requirement.definition);
    if (metrics.length > 0) {
      // Add just the key metrics, not the entire definition
      const keyMetric = metrics[0]; // Just use the first metric as context
      question = question.replace(requirement.text.toLowerCase(),
        `${requirement.text.toLowerCase()} (achieving ${keyMetric})`);
    }
  }

  return question;
}

function containsMetrics(definition: string): boolean {
  // Check for numbers, percentages, time frames
  return /\d+|%|per\s+(day|hour|week|month)|within\s+\d+/i.test(definition);
}

function extractMetrics(definition: string): string[] {
  const metrics: string[] = [];
  
  // Extract percentages
  const percentages = definition.match(/\d+%/g);
  if (percentages) metrics.push(...percentages);
  
  // Extract volumes
  const volumes = definition.match(/\d+\+?\s*(calls|emails|tickets|patients|claims|records)/gi);
  if (volumes) metrics.push(...volumes);
  
  // Extract time frames
  const timeframes = definition.match(/(within\s+)?\d+\s*(hours?|days?|minutes?)/gi);
  if (timeframes) metrics.push(...timeframes);
  
  // Extract rates
  const rates = definition.match(/\d+\s*per\s*(hour|day|week|month)/gi);
  if (rates) metrics.push(...rates);
  
  return metrics;
}

function generateMetricQuestion(requirement: Requirement): InterviewQuestion {
  const metrics = extractMetrics(requirement.definition || '');
  
  return {
    id: `${requirement.id}-metric`,
    question: `Describe a specific time when you achieved ${metrics.join(' and ')} while ${requirement.text.toLowerCase()}. Walk me through how you accomplished this.`,
    requirementId: requirement.id,
    category: 'requirement',
    expectedBehavior: 'Demonstrates ability to meet specific performance metrics',
    isSTAR: true,
    followUps: [
      "How did you track your performance?",
      "What strategies helped you meet these targets?",
      "How consistent were you in hitting these metrics?"
    ]
  };
}

/**
 * Validates if a question is open-ended and requires specific examples
 * @param question - The question text to validate
 * @returns true if question is valid, false otherwise
 */
export function validateQuestion(question: string): boolean {
  // Fail if it's a yes/no question
  const yesNoPatterns = [
    /^(do|did|can|could|would|will|are|were|have|has|is)\s+you\b/i,
    /^(are|were)\s+you\s+(comfortable|familiar|experienced)\b/i
  ];
  
  if (yesNoPatterns.some(pattern => pattern.test(question))) {
    return false;
  }
  
  // Pass if it requires specific examples
  const goodPatterns = [
    /tell\s+me\s+about/i,
    /describe/i,
    /walk\s+me\s+through/i,
    /give\s+me\s+an?\s+example/i,
    /explain/i,
    /what\s+was\s+your\s+(process|approach)/i
  ];
  
  return goodPatterns.some(pattern => pattern.test(question));
}
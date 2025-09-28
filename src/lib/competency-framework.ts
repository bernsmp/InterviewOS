// lib/competency-framework.ts

import { KSAOCategory } from './ksao-framework';

export interface CompetencyDefinition {
  requirement: string;
  definedAs: string;
  measurableCriteria: string[];
  performanceIndicators: PerformanceIndicator[];
  behavioralAnchors: BehavioralAnchor[];
}

export interface PerformanceIndicator {
  metric: string;
  minimum: string;
  target: string;
  frequency?: string;
}

export interface BehavioralAnchor {
  level: 'poor' | 'acceptable' | 'good' | 'excellent';
  description: string;
  example: string;
}

export interface STARQuestion {
  questionText: string;
  category: KSAOCategory;
  situationPrompt: string;
  expectedTaskElements: string[];
  expectedActionElements: string[];
  resultMetrics: string[];
  followUpQuestions: string[];
}

// Templates for generating STAR questions based on KSAO category
export const STAR_TEMPLATES: Record<KSAOCategory, string[]> = {
  Knowledge: [
    'Describe a time when you had to apply your knowledge of {topic} to solve a problem.',
    'Tell me about a situation where your understanding of {topic} was critical to success.',
    'Give an example of when you had to explain {topic} to someone unfamiliar with it.',
    'Walk me through a time when you identified an issue related to {topic}.',
  ],
  Skills: [
    'Tell me about a time you used {skill} to complete a challenging task.',
    'Describe your most complex project involving {skill}.',
    'Give me an example of when you had to quickly learn and apply {skill}.',
    'Walk me through your process when you last used {skill} under pressure.',
  ],
  Abilities: [
    'Describe a time when you had to {ability} in a challenging situation.',
    'Tell me about your highest-volume day handling {ability}.',
    'Give an example of maintaining {ability} when things went wrong.',
    'Share a time when your {ability} was tested to its limits.',
  ],
  Other: [
    'How did you obtain your {certification}?',
    'Describe a situation where your {trait} made a difference.',
    'Tell me about a time your {characteristic} was essential.',
    'Give an example of how you demonstrate {value} at work.',
  ],
};

// Follow-up questions to dig deeper into responses
export const FOLLOW_UP_QUESTIONS = [
  'What was the specific outcome?',
  'How did you measure success?',
  'What would you do differently?',
  'Who else was involved and what was your specific role?',
  'What was the timeline for this?',
  'What challenges did you face?',
  'How did you prioritize your actions?',
  'What feedback did you receive?',
];

// Function to transform vague requirement into competency definition
export function defineCompetency(
  vagueRequirement: string,
  context: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _industry?: string
): CompetencyDefinition {
  // This would be enhanced with AI, but here's a structured approach
  return {
    requirement: vagueRequirement,
    definedAs: context,
    measurableCriteria: [],
    performanceIndicators: [],
    behavioralAnchors: [],
  };
}

// Function to generate STAR questions from defined competency
export function generateSTARQuestions(
  competency: CompetencyDefinition,
  category: KSAOCategory,
  count: number = 3
): STARQuestion[] {
  const questions: STARQuestion[] = [];
  const templates = STAR_TEMPLATES[category];
  
  for (let i = 0; i < Math.min(count, templates.length); i++) {
    const template = templates[i];
    const questionText = template.replace(/{(\w+)}/g, competency.definedAs);
    
    questions.push({
      questionText,
      category,
      situationPrompt: getSituationPrompt(competency),
      expectedTaskElements: getExpectedTaskElements(competency),
      expectedActionElements: getExpectedActionElements(competency),
      resultMetrics: getResultMetrics(competency),
      followUpQuestions: FOLLOW_UP_QUESTIONS.slice(0, 3),
    });
  }
  
  return questions;
}

// Helper functions for STAR question generation
function getSituationPrompt(competency: CompetencyDefinition): string {
  return `In your response, describe the specific context: the organization, your role, and why this situation required ${competency.definedAs}`;
}

function getExpectedTaskElements(competency: CompetencyDefinition): string[] {
  return competency.measurableCriteria.map(criteria => 
    `The specific challenge or goal related to ${criteria}`
  );
}

function getExpectedActionElements(competency: CompetencyDefinition): string[] {
  return competency.performanceIndicators.map(indicator => 
    `Steps taken to achieve ${indicator.metric}`
  );
}

function getResultMetrics(competency: CompetencyDefinition): string[] {
  return competency.performanceIndicators.map(indicator => 
    `${indicator.metric}: achieved ${indicator.target}`
  );
}

// Validate that a question isn't too vague
export function validateQuestion(question: string): boolean {
  const vaguePhrases = [
    'do you have',
    'are you familiar',
    'do you know',
    'have you ever',
    'are you comfortable',
    'do you like',
  ];
  
  const lowerQuestion = question.toLowerCase();
  
  // Check if question starts with vague phrases
  const isVague = vaguePhrases.some(phrase => lowerQuestion.startsWith(phrase));
  
  // Check if question is yes/no without follow-up
  const isYesNo = lowerQuestion.startsWith('do you') || 
                   lowerQuestion.startsWith('are you') ||
                   lowerQuestion.startsWith('have you');
  
  const hasFollowUp = lowerQuestion.includes('describe') ||
                       lowerQuestion.includes('explain') ||
                       lowerQuestion.includes('tell me') ||
                       lowerQuestion.includes('walk me');
  
  return !isVague && (!isYesNo || hasFollowUp);
}

// Industry-specific competency examples
export const INDUSTRY_COMPETENCIES: Record<string, Partial<CompetencyDefinition>[]> = {
  medical: [
    {
      requirement: 'Patient care experience',
      definedAs: 'Direct patient interaction in clinical setting',
      measurableCriteria: [
        'Handle 20-30 patients per day',
        'Maintain 95% satisfaction score',
        'Complete documentation within 2 hours',
      ],
      performanceIndicators: [
        { metric: 'Patient volume', minimum: '15/day', target: '25/day' },
        { metric: 'Documentation time', minimum: '3 hours', target: '2 hours' },
        { metric: 'Error rate', minimum: '< 5%', target: '< 1%' },
      ],
    },
  ],
  tech: [
    {
      requirement: 'Full-stack development',
      definedAs: 'Build end-to-end web applications',
      measurableCriteria: [
        'Deploy features from database to UI',
        'Write unit tests with 80% coverage',
        'Participate in code reviews',
      ],
      performanceIndicators: [
        { metric: 'Features shipped', minimum: '2/month', target: '5/month' },
        { metric: 'Code coverage', minimum: '70%', target: '85%' },
        { metric: 'PR turnaround', minimum: '48hrs', target: '24hrs' },
      ],
    },
  ],
  sales: [
    {
      requirement: 'B2B sales experience',
      definedAs: 'Enterprise software sales to Fortune 500',
      measurableCriteria: [
        'Manage deals worth $100K-$1M',
        'Navigate 6-month sales cycles',
        'Engage C-level executives',
      ],
      performanceIndicators: [
        { metric: 'Quota attainment', minimum: '80%', target: '110%' },
        { metric: 'Deal size', minimum: '$100K', target: '$500K' },
        { metric: 'Close rate', minimum: '15%', target: '25%' },
      ],
    },
  ],
};
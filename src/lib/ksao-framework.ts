// lib/ksao-framework.ts

export type KSAOCategory = 'Knowledge' | 'Skills' | 'Abilities' | 'Other';

export interface KSAODefinition {
  category: KSAOCategory;
  keywords: string[];
  examples: string[];
  questionTypes: string[];
}

export const KSAOFramework: Record<KSAOCategory, KSAODefinition> = {
  Knowledge: {
    category: 'Knowledge',
    keywords: ['know', 'understand', 'familiar', 'aware', 'regulations', 'procedures', 'concepts', 'terminology', 'principles', 'theory'],
    examples: ['HIPAA regulations', 'ICD-10 coding', 'medical terminology', 'accounting principles', 'legal requirements'],
    questionTypes: ['factual', 'explanation', 'scenario-based knowledge application']
  },
  Skills: {
    category: 'Skills',
    keywords: ['perform', 'operate', 'use', 'create', 'build', 'analyze', 'implement', 'execute', 'develop'],
    examples: ['EMR data entry', 'phlebotomy', 'coding', 'design', 'troubleshoot', 'customer service'],
    questionTypes: ['demonstration', 'process walkthrough', 'past performance']
  },
  Abilities: {
    category: 'Abilities',
    keywords: ['able to', 'capacity', 'can', 'capable', 'aptitude', 'multitask', 'manage', 'handle'],
    examples: ['process 50 calls daily', 'lift 50lbs', 'stand 8 hours', 'type 60WPM', 'remain calm under pressure'],
    questionTypes: ['volume/frequency', 'performance metrics', 'stress scenarios']
  },
  Other: {
    category: 'Other',
    keywords: ['certification', 'license', 'trait', 'personality', 'mindset', 'credential', 'degree'],
    examples: ['CMA certification', 'RN license', 'empathy', 'detail-oriented', 'growth mindset'],
    questionTypes: ['verification', 'behavioral demonstration', 'situational judgment']
  }
};

// Function to categorize a requirement
export function categorizeRequirement(requirement: string): KSAOCategory {
  const lowerReq = requirement.toLowerCase();
  
  // Check for certifications/licenses first (most specific)
  if (lowerReq.includes('certification') || lowerReq.includes('license') || lowerReq.includes('credential')) {
    return 'Other';
  }
  
  // Check each category's keywords
  for (const [category, definition] of Object.entries(KSAOFramework)) {
    if (definition.keywords.some(keyword => lowerReq.includes(keyword))) {
      return category as KSAOCategory;
    }
  }
  
  // Default to Skills if no clear match
  return 'Skills';
}

// Function to suggest question types based on KSAO category
export function getQuestionTypesForCategory(category: KSAOCategory): string[] {
  return KSAOFramework[category].questionTypes;
}
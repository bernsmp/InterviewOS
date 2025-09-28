// lib/vagueness-detector.ts

export interface VaguenessAnalysis {
  isVague: boolean;
  confidence: number; // 0-1 scale
  reason: string;
  suggestions: string[];
}

// Patterns that indicate vague requirements
const VAGUE_PATTERNS = [
  /good\s+(at|with)/i,
  /experience\s+(with|in)/i,
  /knowledge\s+of/i,
  /skills?\s+in/i,
  /familiar\s+with/i,
  /comfortable\s+with/i,
  /understanding\s+of/i,
  /ability\s+to/i,
  /proficient\s+in/i,
  /excellent\s+\w+\s+skills/i,
  /strong\s+\w+\s+skills/i,
  /effective\s+\w+/i,
  /proven\s+track\s+record/i,
  /team\s+player/i,
  /self[\s-]starter/i,
  /detail[\s-]oriented/i,
  /problem[\s-]solving/i,
  /communication\s+skills/i,
  /organizational\s+skills/i,
  /multitasking/i,
  /customer\s+service/i,
  /interpersonal\s+skills/i,
  /analytical\s+skills/i,
  /leadership\s+qualities/i,
];

// Patterns that indicate specific, measurable requirements
const SPECIFIC_PATTERNS = [
  /\d+\s+(years?|months?)/i,           // "3 years experience"
  /\d+\s*\+?\s*(years?|months?)/i,     // "5+ years"
  /certification\s+in/i,                // "certification in..."
  /certified\s+\w+/i,                   // "certified medical assistant"
  /license[d]?\s+\w+/i,                 // "licensed RN"
  /(bachelor|master|doctorate|associate)['']?s?\s+degree/i,
  /\d+\s*wpm/i,                         // "60 WPM"
  /\d+\s*(pounds?|lbs?)/i,              // "50 pounds"
  /\$[\d,]+/,                           // "$50,000"
  /\d+%/,                               // "95%"
  /specific\s+software:/i,              // When they list specific tools
];

// Context-specific vague terms by industry
const INDUSTRY_VAGUE_TERMS: Record<string, string[]> = {
  medical: [
    'healthcare knowledge',
    'medical terminology',
    'patient care',
    'clinical experience',
    'HIPAA compliant',
  ],
  tech: [
    'technical skills',
    'programming experience',
    'agile experience',
    'cloud knowledge',
    'full-stack',
  ],
  sales: [
    'sales experience',
    'customer relationships',
    'closing skills',
    'pipeline management',
    'quota achievement',
  ],
  general: [
    'professional demeanor',
    'work ethic',
    'reliable',
    'motivated',
    'flexible',
  ],
};

export function detectVagueness(requirement: string): VaguenessAnalysis {
  const lowerReq = requirement.toLowerCase();
  
  // Check if it's specifically defined (not vague)
  const hasSpecificPattern = SPECIFIC_PATTERNS.some(pattern => pattern.test(requirement));
  if (hasSpecificPattern) {
    return {
      isVague: false,
      confidence: 0.9,
      reason: 'Contains specific, measurable criteria',
      suggestions: [],
    };
  }
  
  // Check for vague patterns
  const matchedVaguePatterns = VAGUE_PATTERNS.filter(pattern => pattern.test(requirement));
  const vaguenessScore = matchedVaguePatterns.length / VAGUE_PATTERNS.length;
  
  if (matchedVaguePatterns.length > 0) {
    return {
      isVague: true,
      confidence: Math.min(0.95, 0.6 + vaguenessScore),
      reason: 'Contains vague, non-specific language that needs definition',
      suggestions: generateSuggestions(requirement),
    };
  }
  
  // Check for industry-specific vague terms
  for (const [industry, terms] of Object.entries(INDUSTRY_VAGUE_TERMS)) {
    if (terms.some(term => lowerReq.includes(term))) {
      return {
        isVague: true,
        confidence: 0.75,
        reason: `Contains industry jargon that needs specific definition`,
        suggestions: generateIndustrySuggestions(requirement, industry),
      };
    }
  }
  
  // If no patterns match, consider it acceptable
  return {
    isVague: false,
    confidence: 0.7,
    reason: 'Appears to be adequately specific',
    suggestions: [],
  };
}

function generateSuggestions(requirement: string): string[] {
  const suggestions: string[] = [];
  const lowerReq = requirement.toLowerCase();
  
  if (lowerReq.includes('experience')) {
    suggestions.push('Specify the number of years required');
    suggestions.push('Define the specific tasks they should have performed');
    suggestions.push('Indicate the industry or setting of the experience');
  }
  
  if (lowerReq.includes('knowledge')) {
    suggestions.push('List the specific facts or concepts they must know');
    suggestions.push('Specify the depth of knowledge required (basic, intermediate, expert)');
    suggestions.push('Identify how this knowledge will be applied in the role');
  }
  
  if (lowerReq.includes('skills')) {
    suggestions.push('Name the specific tools or software they must use');
    suggestions.push('Define the proficiency level required');
    suggestions.push('Specify the frequency of skill usage (daily, weekly, occasional)');
  }
  
  if (lowerReq.includes('communication')) {
    suggestions.push('Specify the audience (patients, executives, team members)');
    suggestions.push('Define the format (written, verbal, presentations)');
    suggestions.push('Indicate volume (how many interactions per day)');
  }
  
  if (lowerReq.includes('customer service')) {
    suggestions.push('Define the types of customer issues they will handle');
    suggestions.push('Specify the volume of customers per day');
    suggestions.push('Indicate the resolution rate or satisfaction score expected');
  }
  
  return suggestions.length > 0 ? suggestions : [
    'Define specific, measurable criteria',
    'Include performance metrics or volume expectations',
    'Specify the tools, systems, or processes involved',
  ];
}

function generateIndustrySuggestions(requirement: string, industry: string): string[] {
  const industrySpecificSuggestions: Record<string, string[]> = {
    medical: [
      'Specify which EMR/EHR systems',
      'Define which medical specialties',
      'List specific procedures they must know',
      'Indicate patient volume expectations',
      'Specify which regulations or compliance standards',
    ],
    tech: [
      'List specific programming languages',
      'Name the frameworks and libraries',
      'Specify the development environment',
      'Define code quality metrics',
      'Indicate deployment frequency',
    ],
    sales: [
      'Specify average deal size',
      'Define the sales cycle length',
      'Indicate quota expectations',
      'Specify the CRM system',
      'Define the target market',
    ],
    general: [
      'Provide specific behavioral examples',
      'Define measurable outcomes',
      'Specify the frequency of the behavior',
      'Indicate the context where this applies',
    ],
  };
  
  return industrySpecificSuggestions[industry] || industrySpecificSuggestions.general;
}

// Helper function to get a user-friendly message about why something is vague
export function getVaguenessExplanation(requirement: string): string {
  const lowerReq = requirement.toLowerCase();
  
  if (lowerReq.includes('experience')) {
    return 'This requirement needs specifics: How many years? What specific tasks? In what setting?';
  }
  
  if (lowerReq.includes('knowledge')) {
    return 'Define what they actually need to know: Specific concepts? Regulations? Procedures?';
  }
  
  if (lowerReq.includes('skills')) {
    return 'Be specific about the skills: Which tools? What proficiency level? How often used?';
  }
  
  if (lowerReq.includes('communication')) {
    return 'Communication with whom? How often? In what format? What\'s the success metric?';
  }
  
  if (lowerReq.includes('team')) {
    return 'Define the team context: Team size? Role on team? Specific collaboration examples?';
  }
  
  return 'This requirement is too general. What specific, measurable behaviors do you need?';
}
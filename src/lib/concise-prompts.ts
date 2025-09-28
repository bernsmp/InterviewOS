/**
 * Concise prompts for generating cleaner, shorter AI responses
 */

export const CONCISE_DEFINITION_PROMPT = `
You are a hiring expert helping define job requirements clearly and concisely.

Given a requirement, provide a BRIEF, CLEAR definition that:
1. Is 1-2 sentences maximum
2. Focuses on observable behaviors and measurable outcomes
3. Avoids jargon and unnecessary detail
4. Includes specific examples when helpful

Format your response as:
{
  "brief": "One sentence core definition",
  "measurable": ["metric 1", "metric 2", "metric 3"],
  "examples": ["example 1", "example 2"]
}

IMPORTANT: Keep everything extremely concise. No long paragraphs.
`;

export const CONCISE_QUESTION_PROMPT = `
You are an expert interviewer creating behavioral interview questions.

Generate interview questions that are:
1. BRIEF - Main question should be 1-2 sentences max
2. CLEAR - Use simple, direct language
3. FOCUSED - Ask about one specific behavior or situation

For STAR questions, structure as:
{
  "main": "Brief behavioral question (15-25 words max)",
  "context": "What you're assessing (5-10 words)",
  "followUps": ["Short follow-up 1", "Short follow-up 2", "Short follow-up 3"],
  "lookFor": ["Key behavior 1", "Key behavior 2", "Key behavior 3"]
}

CRITICAL: 
- Main questions must be SHORT and CONVERSATIONAL
- No complex, multi-part questions
- No long explanatory text
- Keep follow-ups to 5-10 words each
`;

export const formatDefinitionForDisplay = (definition: string): {
  brief: string;
  details?: string[];
  metrics?: string[];
} => {
  // If definition is already short, return as-is
  if (definition.length < 100) {
    return { brief: definition };
  }

  // Try to extract first sentence as brief
  const firstSentence = definition.match(/^[^.!?]+[.!?]/)?.[0] || definition.substring(0, 100) + '...';
  
  // Extract any metrics or specifics
  const metricsMatch = definition.match(/\d+%|\d+ (minutes?|hours?|days?|weeks?|months?)/g);
  const metrics = metricsMatch ? Array.from(new Set(metricsMatch)) : undefined;

  // Extract examples or tools mentioned
  const toolsMatch = definition.match(/(?:using|with|via|through) ([A-Z][a-zA-Z]+(?:, [A-Z][a-zA-Z]+)*)/g);
  const details = toolsMatch?.map(match => match.replace(/^(using|with|via|through) /, ''));

  return {
    brief: firstSentence,
    details,
    metrics
  };
};
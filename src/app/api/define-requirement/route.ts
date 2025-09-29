import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { INDUSTRY_COMPETENCIES } from "@/lib/competency-framework";
import { categorizeRequirement } from "@/lib/ksao-framework";
import { z } from "zod";

// Input validation schema
const defineRequirementSchema = z.object({
  requirement: z.string()
    .min(3, "Requirement must be at least 3 characters")
    .max(500, "Requirement must not exceed 500 characters")
    .trim(),
  industry: z.string().optional().default("general")
});

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = defineRequirementSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: "Invalid input", 
          details: validationResult.error.issues.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        },
        { status: 400 }
      );
    }
    
    const { requirement, industry } = validationResult.data;

    // Get KSAO category
    const ksaoCategory = categorizeRequirement(requirement);
    
    // Industry competencies could be used here for more context-aware definitions
    // const industryExamples = INDUSTRY_COMPETENCIES[industry] || INDUSTRY_COMPETENCIES.general || [];

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `You are creating BRIEF, CLEAR job requirement definitions.

REQUIREMENT: "${requirement}"
CATEGORY: ${ksaoCategory}

Write a concise definition (MAX 60 words) that includes:
1. What it means (one sentence)
2. 2-3 specific indicators or metrics
3. Key tools/methods if relevant

Example output:
"Customer service means resolving inquiries professionally and efficiently. Measured by: 90%+ satisfaction scores, handling 20-30 calls daily, using CRM systems effectively."

Rules:
- Be extremely concise
- Use simple language
- Include specific numbers
- Focus on observable actions
- No generic statements

Return ONLY the definition.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const definition = response.text().trim();
    
    return NextResponse.json({ 
      definition,
      ksaoCategory,
      suggestions: getAdditionalSuggestions(requirement, ksaoCategory)
    });
    
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: "Failed to generate requirement definition" },
      { status: 500 }
    );
  }
}

function getAdditionalSuggestions(requirement: string, ksaoCategory: string): string[] {
  const suggestions: string[] = [];
  
  switch (ksaoCategory) {
    case "Knowledge":
      suggestions.push("Specify which concepts or regulations they must know");
      suggestions.push("Define the depth of knowledge required");
      suggestions.push("Indicate how this knowledge is applied");
      break;
    case "Skills":
      suggestions.push("Name the specific tools or software");
      suggestions.push("Define proficiency level (basic/intermediate/expert)");
      suggestions.push("Specify frequency of use");
      break;
    case "Abilities":
      suggestions.push("Include volume or performance metrics");
      suggestions.push("Define minimum acceptable performance");
      suggestions.push("Specify conditions or constraints");
      break;
    case "Other":
      suggestions.push("Verify specific certifications or licenses");
      suggestions.push("Define behavioral indicators");
      suggestions.push("Specify renewal or maintenance requirements");
      break;
  }
  
  return suggestions;
}
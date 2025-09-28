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
    
    // Get industry examples if available
    const industryExamples = INDUSTRY_COMPETENCIES[industry] || INDUSTRY_COMPETENCIES.general || [];
    const relevantExample = industryExamples[0];

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `You are an expert HR professional helping to define vague job requirements into specific, measurable criteria.

REQUIREMENT TO DEFINE: "${requirement}"
INDUSTRY: ${industry}
KSAO CATEGORY: ${ksaoCategory}

${relevantExample ? `EXAMPLE FROM THIS INDUSTRY:
Original: "${relevantExample.requirement}"
Defined as: "${relevantExample.definedAs}"
Measurable criteria: ${relevantExample.measurableCriteria?.join(", ")}` : ""}

TASK: Transform the vague requirement into a specific, measurable definition that will generate meaningful interview questions.

Your response should include:
1. A clear, specific definition of what this requirement means
2. Measurable criteria (metrics, volume, frequency, tools)
3. Performance indicators where applicable

IMPORTANT:
- Be specific about tools, systems, or processes
- Include numbers/metrics where possible (e.g., "20-30 customers per day")
- Define success criteria (e.g., "95% accuracy", "within 2 hours")
- Focus on observable behaviors and outcomes
- Keep it concise but comprehensive

Return ONLY the specific definition as a single paragraph. Do not include any preamble or explanation.`;

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
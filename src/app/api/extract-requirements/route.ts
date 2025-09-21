import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const { jobDescription } = await request.json();
    
    if (!jobDescription) {
      return NextResponse.json(
        { error: "Job description is required" },
        { status: 400 }
      );
    }

    // Use Gemini 2.0 Flash for the most cost-effective, fast responses
    // You can change this to other models like "gemini-1.5-pro" or "gemini-pro" if needed
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `You are an expert HR professional. Extract job requirements from the following job description. 

IMPORTANT RULES:
1. Extract ONLY the actual requirements (skills, experience, certifications, etc.)
2. Clean up each requirement to be concise and professional
3. Remove duplicate or similar requirements (combine them)
4. Format requirements professionally:
   - "Minimum 2 years of medical office experience" → "2+ years medical office experience"
   - "Proficiency with electronic medical records (EMR/EHR systems)" → "EMR/EHR system proficiency"
   - "Strong interpersonal and communication skills" → "Strong communication skills"
   - "Current Medical Assistant certification (CMA or RMA)" → "Medical Assistant certification (CMA/RMA)"
5. Remove common prefixes like "Must have", "Required", "Ability to", etc.
6. Combine related items (e.g., "interpersonal" and "communication" skills)
7. Return 5-15 distinct requirements maximum
8. Order by importance: certifications/licenses first, then technical skills, then experience, then soft skills

Job Description:
${jobDescription}

Return ONLY a JSON array of requirement strings. Example:
["2+ years medical office experience", "EMR/EHR system proficiency", "Medical Assistant certification (CMA/RMA)"]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    try {
      // Extract JSON array from the response (Gemini might add extra text)
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const requirements = JSON.parse(jsonMatch[0]);
        return NextResponse.json({ requirements });
      } else {
        throw new Error("No valid JSON array found in response");
      }
    } catch {
      console.error("Failed to parse Gemini response:", text);
      // Fallback to basic extraction if Gemini fails
      return NextResponse.json({ 
        requirements: [],
        error: "Failed to parse AI response, please try again"
      });
    }
    
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: "Failed to extract requirements" },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { questions } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `You are an expert interview categorizer. Analyze these interview questions and:
1. Assign each question to ONE category
2. Order categories from most important to least important
3. Within each category, order questions from most insightful to least

Categories to use:
- Technical Skills: Questions about specific technical abilities, tools, technologies
- Experience & Past Performance: Questions about previous work, achievements, examples
- Problem Solving: Scenario questions, how they approach challenges
- Soft Skills & Culture Fit: Communication, teamwork, work style questions
- Growth & Learning: Questions about learning, adaptation, career development

For each question, return:
- category: The category name
- subcategory: A more specific grouping within the category (e.g., "Leadership Experience", "Technical Troubleshooting")
- importance: 1-10 score for how critical this question is

Questions:
${questions.map((q: any, i: number) => `${i + 1}. ${q.question}`).join('\n')}

Return ONLY a JSON array with objects containing: id, category, subcategory, importance
Example: [{"id": "q1", "category": "Technical Skills", "subcategory": "Programming Languages", "importance": 8}]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from response");
    }
    
    const categorizedData = JSON.parse(jsonMatch[0]);
    
    // Map the categorization back to the original questions
    const categorizedQuestions = questions.map((q: any, index: number) => {
      const categoryData = categorizedData.find((c: any) => 
        c.id === q.id || c.id === `q${index + 1}`
      );
      
      return {
        ...q,
        category: categoryData?.category || "Other",
        subcategory: categoryData?.subcategory || "General",
        importance: categoryData?.importance || 5
      };
    });

    // Sort by category importance, then by question importance
    const categoryOrder = [
      "Technical Skills",
      "Experience & Past Performance", 
      "Problem Solving",
      "Soft Skills & Culture Fit",
      "Growth & Learning",
      "Other"
    ];

    categorizedQuestions.sort((a: any, b: any) => {
      const categoryDiff = categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
      if (categoryDiff !== 0) return categoryDiff;
      return b.importance - a.importance; // Higher importance first
    });

    return NextResponse.json({ questions: categorizedQuestions });
  } catch (error) {
    console.error("Categorization error:", error);
    return NextResponse.json(
      { error: "Failed to categorize questions" },
      { status: 500 }
    );
  }
}
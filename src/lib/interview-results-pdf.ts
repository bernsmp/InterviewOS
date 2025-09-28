import jsPDF from "jspdf";
import type { InterviewScript, InterviewResponse } from "@/types/interview";

export function generateInterviewResultsPDF(
  script: InterviewScript,
  responses: InterviewResponse[],
  candidateName: string = "Candidate"
): jsPDF {
  const doc = new jsPDF();
  let yPosition = 20;
  const lineHeight = 7;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const maxWidth = 170;

  // Helper function to check if we need a new page
  const checkNewPage = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = 20;
    }
  };

  // Helper function to add wrapped text
  const addWrappedText = (text: string, fontSize: number = 10, indent: number = 0) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth - indent);
    lines.forEach((line: string) => {
      checkNewPage(lineHeight);
      doc.text(line, margin + indent, yPosition);
      yPosition += lineHeight;
    });
  };

  // Get question by ID
  const getQuestionById = (questionId: string) => {
    return script.questions.find(q => q.id === questionId) || 
           script.natureDiscoveryQuestions?.find(q => q.id === questionId);
  };

  // Calculate stats
  const passCount = responses.filter(r => r.score === "pass").length;
  const maybeCount = responses.filter(r => r.score === "maybe").length;
  const failCount = responses.filter(r => r.score === "fail").length;
  const passRate = Math.round((passCount / responses.length) * 100);

  // Title
  doc.setFontSize(20);
  doc.text("Interview Results", margin, yPosition);
  yPosition += 15;

  // Candidate info
  doc.setFontSize(12);
  doc.text(`Candidate: ${candidateName}`, margin, yPosition);
  yPosition += lineHeight;
  doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, yPosition);
  yPosition += lineHeight;
  doc.text(`Position: ${script.positionTitle} at ${script.companyName}`, margin, yPosition);
  yPosition += lineHeight * 2;

  // Summary Statistics
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Interview Summary", margin, yPosition);
  doc.setFont("helvetica", "normal");
  yPosition += lineHeight * 1.5;

  doc.setFontSize(10);
  doc.text(`Total Questions: ${responses.length}`, margin, yPosition);
  yPosition += lineHeight;
  doc.text(`Pass: ${passCount} (${Math.round((passCount/responses.length)*100)}%)`, margin, yPosition);
  yPosition += lineHeight;
  doc.text(`Maybe: ${maybeCount} (${Math.round((maybeCount/responses.length)*100)}%)`, margin, yPosition);
  yPosition += lineHeight;
  doc.text(`Fail: ${failCount} (${Math.round((failCount/responses.length)*100)}%)`, margin, yPosition);
  yPosition += lineHeight * 2;

  // Overall Recommendation
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Recommendation: ", margin, yPosition);
  
  let recommendation = "";
  if (passRate >= 80) {
    recommendation = "Strong Hire";
    doc.setTextColor(0, 128, 0);
  } else if (passRate >= 60) {
    recommendation = "Potential Hire";
    doc.setTextColor(255, 165, 0);
  } else if (passRate >= 40) {
    recommendation = "Borderline";
    doc.setTextColor(255, 140, 0);
  } else {
    recommendation = "Not Recommended";
    doc.setTextColor(255, 0, 0);
  }
  
  doc.text(recommendation, margin + 80, yPosition);
  doc.setTextColor(0);
  doc.setFont("helvetica", "normal");
  yPosition += lineHeight * 2;

  // Detailed Responses
  checkNewPage(30);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Detailed Interview Responses", margin, yPosition);
  doc.setFont("helvetica", "normal");
  yPosition += lineHeight * 1.5;

  responses.forEach((response, index) => {
    checkNewPage(40);
    
    const question = getQuestionById(response.questionId);
    if (!question) return;

    // Question number and score
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`Question ${index + 1}`, margin, yPosition);
    
    // Score indicator
    doc.setFontSize(10);
    switch (response.score) {
      case "pass":
        doc.setTextColor(0, 128, 0);
        doc.text("[PASS]", margin + 60, yPosition);
        break;
      case "maybe":
        doc.setTextColor(255, 165, 0);
        doc.text("[MAYBE]", margin + 60, yPosition);
        break;
      case "fail":
        doc.setTextColor(255, 0, 0);
        doc.text("[FAIL]", margin + 60, yPosition);
        break;
    }
    doc.setTextColor(0);
    doc.setFont("helvetica", "normal");
    yPosition += lineHeight;

    // Question text
    doc.setFontSize(9);
    addWrappedText(question.question, 9);
    yPosition += 3;

    // Requirement (if applicable)
    if ('requirementId' in question) {
      const requirement = script.requirements.find(r => r.id === question.requirementId);
      if (requirement) {
        doc.setFontSize(8);
        doc.setTextColor(100);
        addWrappedText(`Requirement: ${requirement.text}`, 8);
        doc.setTextColor(0);
        yPosition += 3;
      }
    }

    // Notes
    if (response.notes) {
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("Notes:", margin, yPosition);
      doc.setFont("helvetica", "normal");
      yPosition += lineHeight;
      
      doc.setFontSize(8);
      doc.setTextColor(50);
      addWrappedText(response.notes, 8, 10);
      doc.setTextColor(0);
    }

    yPosition += lineHeight * 2;
  });

  // Footer on last page
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(`Generated by The Hiring Diagnostic on ${new Date().toLocaleString()}`, margin, pageHeight - 15);
  doc.setTextColor(0);

  return doc;
}

export function downloadInterviewResultsPDF(
  script: InterviewScript,
  responses: InterviewResponse[],
  candidateName?: string
) {
  const doc = generateInterviewResultsPDF(script, responses, candidateName);
  const filename = `interview-results-${script.positionTitle.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}
import jsPDF from "jspdf";
import type { InterviewScript } from "@/types/interview";

export function generateInterviewPDF(script: InterviewScript): jsPDF {
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
  const addWrappedText = (text: string, fontSize: number = 10) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line: string) => {
      checkNewPage(lineHeight);
      doc.text(line, margin, yPosition);
      yPosition += lineHeight;
    });
  };

  // Title
  doc.setFontSize(20);
  doc.text("Interview Script", margin, yPosition);
  yPosition += 15;

  // Company and Position
  doc.setFontSize(12);
  doc.text(`Company: ${script.companyName}`, margin, yPosition);
  yPosition += lineHeight;
  doc.text(`Position: ${script.positionTitle}`, margin, yPosition);
  yPosition += lineHeight * 2;

  // Requirements Summary
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Requirements Summary", margin, yPosition);
  doc.setFont("helvetica", "normal");
  yPosition += lineHeight * 1.5;

  const mandatoryReqs = script.requirements.filter(r => r.priority === "mandatory");
  const trainableReqs = script.requirements.filter(r => r.priority === "trainable");
  const niceToHaveReqs = script.requirements.filter(r => r.priority === "nice-to-have");

  doc.setFontSize(10);
  doc.text(`Mandatory: ${mandatoryReqs.length} | Trainable: ${trainableReqs.length} | Nice-to-have: ${niceToHaveReqs.length}`, margin, yPosition);
  yPosition += lineHeight * 2;

  // Mandatory Requirements
  if (mandatoryReqs.length > 0) {
    checkNewPage(30);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Mandatory Requirements", margin, yPosition);
    doc.setFont("helvetica", "normal");
    yPosition += lineHeight;

    mandatoryReqs.forEach((req, index) => {
      const text = `${index + 1}. ${req.text}`;
      addWrappedText(text);
      yPosition += 3;
    });
    yPosition += lineHeight;
  }

  // Interview Questions
  checkNewPage(30);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Interview Questions", margin, yPosition);
  doc.setFont("helvetica", "normal");
  yPosition += lineHeight * 1.5;

  // Group questions by requirement priority
  const mandatoryQuestions = script.questions.filter(q => {
    const req = script.requirements.find(r => r.id === q.requirementId);
    return req?.priority === "mandatory";
  });

  const trainableQuestions = script.questions.filter(q => {
    const req = script.requirements.find(r => r.id === q.requirementId);
    return req?.priority === "trainable";
  });

  const niceToHaveQuestions = script.questions.filter(q => {
    const req = script.requirements.find(r => r.id === q.requirementId);
    return req?.priority === "nice-to-have";
  });

  // Helper to render questions
  const renderQuestions = (questions: typeof script.questions, title: string) => {
    if (questions.length > 0) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(title, margin, yPosition);
      doc.setFont("helvetica", "normal");
      yPosition += lineHeight;

      questions.forEach((question, index) => {
        checkNewPage(30);
        const text = `${index + 1}. ${question.question}`;
        addWrappedText(text);
        
        if (question.expectedBehavior) {
          doc.setFontSize(8);
          doc.setTextColor(100);
          addWrappedText(`Expected: ${question.expectedBehavior}`, 8);
          doc.setTextColor(0);
        }
        
        // Add space for notes
        yPosition += 5;
        doc.setFontSize(8);
        doc.text("Notes: _____________________________________________", margin, yPosition);
        yPosition += lineHeight * 2;
      });

      yPosition += lineHeight;
    }
  };

  // Render all question categories
  renderQuestions(mandatoryQuestions, "Questions for Mandatory Requirements");
  renderQuestions(trainableQuestions, "Questions for Trainable Requirements");
  renderQuestions(niceToHaveQuestions, "Questions for Nice-to-Have Requirements");

  // Nature Discovery Questions
  checkNewPage(30);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Nature Discovery Questions", margin, yPosition);
  doc.setFont("helvetica", "normal");
  yPosition += lineHeight;

  script.natureDiscoveryQuestions.forEach((question, index) => {
    checkNewPage(40);
    const text = `${index + 1}. ${question.question}`;
    addWrappedText(text);
    
    doc.setFontSize(8);
    doc.setTextColor(100);
    addWrappedText(`Purpose: ${question.purpose}`, 8);
    doc.setTextColor(0);
    
    // Add space for notes
    yPosition += 5;
    doc.setFontSize(8);
    doc.text("Notes: _____________________________________________", margin, yPosition);
    yPosition += lineHeight * 2;
  });

  // Scoring Guide
  doc.addPage();
  yPosition = 20;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Scoring Guide", margin, yPosition);
  doc.setFont("helvetica", "normal");
  yPosition += lineHeight * 2;

  doc.setFontSize(10);
  const scoringGuide = [
    "Pass: Strong answer with specific examples and clear expertise",
    "Maybe: Partial answer showing potential but lacking depth",
    "Fail: Weak answer, no examples, or red flags identified"
  ];

  scoringGuide.forEach(line => {
    doc.text(`• ${line}`, margin, yPosition);
    yPosition += lineHeight;
  });

  yPosition += lineHeight * 2;
  doc.text("Remember: Look for specific examples and measurable behaviors, not generic answers.", margin, yPosition);

  return doc;
}

export function downloadInterviewPDF(script: InterviewScript) {
  const doc = generateInterviewPDF(script);
  const filename = `interview-script-${script.positionTitle.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}
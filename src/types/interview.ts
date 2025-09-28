export type RequirementPriority = 'mandatory' | 'trainable' | 'nice-to-have';

export interface Requirement {
  id: string;
  text: string;
  priority: RequirementPriority;
  definition?: string;
  ksaoCategory?: string;
  isMandatory?: boolean;
  isTrainable?: boolean;
  willingToTrain?: boolean;
  finalClassification?: 'must-have' | 'nice-to-have' | 'will-train';
}

export interface InterviewQuestion {
  id: string;
  question: string;
  requirementId?: string;
  category: 'requirement' | 'nature-discovery';
  expectedBehavior?: string;
  isSTAR?: boolean;
  followUps?: string[];
}

export interface NatureDiscoveryQuestion {
  id: string;
  question: string;
  purpose: string;
}

export interface InterviewResponse {
  questionId: string;
  score: 'pass' | 'fail' | 'maybe';
  notes: string;
}

// Union type for all question types
export type Question = InterviewQuestion | NatureDiscoveryQuestion;

export interface InterviewScript {
  id: string;
  companyName: string;
  positionTitle: string;
  jobDescription: string;
  requirements: Requirement[];
  questions: InterviewQuestion[];
  natureDiscoveryQuestions: NatureDiscoveryQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CandidateInterview {
  id: string;
  scriptId: string;
  candidateName: string;
  candidateEmail: string;
  responses: InterviewResponse[];
  overallScore: 'pass' | 'fail' | 'maybe';
  notes: string;
  interviewedAt: Date;
}
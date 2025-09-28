# Interview Framework Knowledge Base for InterviewOS

## 🎯 Core Problem We're Solving
Users have "cursive knowledge" (curse of knowledge) - they know what they mean by "customer service experience" but haven't defined it specifically enough to create meaningful interview questions. This leads to useless questions like "Do you have customer service experience?" with "Yes" answers that reveal nothing.

## 📊 KSAO Framework (Knowledge, Skills, Abilities, Other)
The gold standard for job analysis and requirement decomposition.

### Knowledge
- **Definition**: Body of factual or procedural information that can be applied
- **Examples**: 
  - Medical: "HIPAA regulations," "ICD-10 coding," "Medicare billing procedures"
  - Technical: "Python syntax," "AWS services," "GAAP accounting principles"
- **Interview Questions**: "What specific regulations govern..." "Explain the process for..."

### Skills
- **Definition**: Learned activities and capabilities to perform tasks accurately
- **Examples**:
  - Medical: "Venipuncture technique," "EMR data entry," "Insurance verification"
  - Technical: "Debug code," "Design databases," "Create financial models"
- **Interview Questions**: "Demonstrate how you would..." "Walk me through your process for..."

### Abilities
- **Definition**: Stable capacities to perform, including cognitive, sensory, and physical
- **Examples**:
  - Volume: "Process 50+ calls daily," "Type 60 WPM," "Lift 50 pounds"
  - Cognitive: "Analyze complex data," "Multitask under pressure"
  - Interpersonal: "Remain calm with upset patients," "Build rapport quickly"
- **Interview Questions**: "Describe your highest volume day..." "How do you maintain accuracy when..."

### Other Characteristics
- **Definition**: Personality traits, certifications, values, work style that don't fit other categories
- **Examples**:
  - Certifications: "CMA certification," "PMP credential," "Series 7 license"
  - Traits: "Cultural sensitivity," "Growth mindset," "Attention to detail"
  - Work style: "Self-directed," "Team-oriented," "Deadline-driven"
- **Interview Questions**: "Do you have [specific certification]?" "Give an example of when you demonstrated..."

## 🔄 Requirement Decomposition Process

### Step 1: Identify Vague Requirements
**Vague Triggers** (need decomposition):
- "Experience with..."
- "Knowledge of..."
- "Good communication skills"
- "Customer service oriented"
- "Team player"
- "Problem-solving skills"
- "Attention to detail"
- "Multitasking abilities"
- "Technical skills"
- "Leadership qualities"

**Already Specific** (can skip):
- "RN license required"
- "3 years experience in acute care"
- "Must type 60 WPM"
- "Bilingual Spanish/English"
- "Master's degree in Finance"

### Step 2: Force Specific Definition
For each vague requirement, ask:

1. **Context Question**: "In YOUR specific workplace, what does [requirement] mean?"
2. **Frequency Question**: "How often must they demonstrate this?"
3. **Volume Question**: "What quantity/speed/accuracy is required?"
4. **Scenario Question**: "Give me a specific example of when this would be critical"
5. **Failure Question**: "What would happen if someone DIDN'T have this?"

### Step 3: Convert to Measurable Criteria
Transform vague requirements into measurable performance indicators:

**Before**: "Good communication skills"
**After**: 
- "Explain insurance denials to upset patients without escalation in 80% of cases"
- "Document patient interactions in EMR within 2 hours of appointment"
- "Present treatment plans to patients with 90% comprehension rate"

**Before**: "Healthcare knowledge"
**After**:
- "Identify top 20 medications in our specialty by sight"
- "Code procedures using CPT codes with 95% accuracy"
- "Explain HIPAA requirements to new staff"

## 📋 Competency-Based Interview Framework

### Core Principles
1. **Past behavior predicts future performance**
2. **Focus on specific situations, not hypotheticals**
3. **Require detailed examples with measurable outcomes**
4. **Probe for individual contribution, not team achievements**

### STAR Method Structure
Questions should elicit:
- **Situation** (15%): Context and background
- **Task** (15%): Specific responsibility or challenge
- **Action** (60%): Detailed steps taken by the individual
- **Result** (10%): Measurable outcome and lessons learned

### Behavioral Question Starters
- "Tell me about a time when..."
- "Describe a situation where..."
- "Give me an example of..."
- "Walk me through a specific instance when..."
- "Share an experience where..."

## 🎯 Medical Assistant Example Transformation

### Original Vague Requirements
1. "Medical assistant certification"
2. "Knowledge of medical terminology and procedures"
3. "Experience with medical software"
4. "Good organizational skills"
5. "Ability to multitask"

### After KSAO Decomposition

#### Requirement 1: Medical Assistant Certification
- **Type**: Other (Certification)
- **Definition**: Current CMA or RMA certification
- **Questions**: 
  - "Do you have current CMA or RMA certification?"
  - "When does your certification expire?"

#### Requirement 2: Medical Terminology Knowledge
- **Type**: Knowledge
- **Definition**: Must know terminology specific to orthopedic practice
- **Measurable Criteria**: 
  - Understand 50+ common orthopedic conditions
  - Know anatomical terms for musculoskeletal system
  - Familiar with surgical procedure names
- **Questions**:
  - "What's the difference between a sprain and a strain?"
  - "Explain what an MRI would show for a torn ACL"
  - "Define these terms: arthroscopy, osteotomy, arthroplasty"

#### Requirement 3: EMR Proficiency
- **Type**: Skill
- **Definition**: Navigate Epic EMR for patient scheduling and documentation
- **Measurable Criteria**:
  - Schedule 20+ patients daily
  - Complete encounter notes within 30 minutes
  - Process lab orders without errors
- **Questions**:
  - "Which EMR systems have you used and for how long?"
  - "Walk me through scheduling a follow-up with lab work in Epic"
  - "How many patient encounters did you document daily?"

#### Requirement 4: Organizational Skills
- **Type**: Ability
- **Definition**: Manage multiple exam rooms and patient flow
- **Measurable Criteria**:
  - Keep 3 exam rooms flowing without delays
  - Prep rooms in under 5 minutes
  - Track supplies and reorder before stockout
- **Questions**:
  - "Describe your system for managing multiple exam rooms"
  - "Tell me about a time you prevented a delay in patient flow"
  - "How do you track supply inventory?"

## 🚀 Implementation Strategy for InterviewOS

### Phase 1: Requirement Analysis
1. AI extracts requirements from job description
2. System categorizes each as K/S/A/O
3. Identifies vague vs specific requirements

### Phase 2: Definition Forcing
For vague requirements:
1. Present KSAO framework explanation
2. Show examples from same industry
3. Force user to define:
   - Specific behaviors/knowledge needed
   - Minimum acceptable performance level
   - How they would measure success
4. Provide AI suggestions if stuck

### Phase 3: Question Generation
Based on defined requirements:
1. Certifications → Single verification question
2. Knowledge → Factual/scenario questions
3. Skills → Demonstration/process questions
4. Abilities → Performance/volume questions
5. Other → Behavioral/trait questions

### Phase 4: Classification Update
New logic for Mandatory/Trainable:
- Is it mandatory? (Yes/No)
- Is it trainable? (Yes/No)
- Are you willing to train? (Yes/No)
- If Mandatory + Trainable + Willing = Not actually mandatory
- If Mandatory + Not trainable = True mandatory
- If Mandatory + Trainable + Not willing = True mandatory

## 💡 AI Suggestion Engine

When users struggle to define requirements, AI suggests based on:

### Industry Templates
**Medical Assistant**: Volume (patients/day), Software (specific EMR), Procedures (which ones)
**Customer Service**: Call volume, Resolution rate, Escalation percentage
**Software Developer**: Languages, Frameworks, Code review process, Deploy frequency
**Sales**: Deal size, Sales cycle, CRM system, Quota achievement

### Probing Questions Bank
- "What would a day in this role look like?"
- "What's the difference between someone who excels vs barely meets expectations?"
- "What specific tools/software must they use?"
- "What's the most complex task they'd handle?"
- "How would you know on day 30 if you made a good hire?"
- "What mistakes could they make that would be dealbreakers?"

## 📈 Success Metrics

### Before Implementation
- Average question quality: "Do you have experience with X?"
- Useful information gathered: 20%
- Bad hire rate: 40%

### After Implementation  
- Question quality: "Describe handling 50 calls about insurance denials"
- Useful information gathered: 85%
- Bad hire rate: <15%

## 🔧 Technical Requirements

### Vagueness Detection Algorithm
```javascript
function isVague(requirement) {
  const vaguePatterns = [
    /good\s+(at|with)/i,
    /experience\s+with/i,
    /knowledge\s+of/i,
    /skills?\s+in/i,
    /familiar\s+with/i,
    /comfortable\s+with/i,
    /understanding\s+of/i,
    /ability\s+to/i,
    /proficient\s+in/i
  ];
  
  const specificExceptions = [
    /\d+\s+years?/i,  // Has specific number of years
    /certification/i,  // Is a certification
    /license/i,        // Is a license
    /degree/i          // Is a degree
  ];
  
  // Check if it's specifically defined
  if (specificExceptions.some(pattern => pattern.test(requirement))) {
    return false;
  }
  
  // Check if it contains vague language
  return vaguePatterns.some(pattern => pattern.test(requirement));
}
```

### KSAO Categorization
```javascript
const KSAOCategories = {
  Knowledge: {
    keywords: ['know', 'understand', 'familiar', 'aware', 'regulations', 'procedures', 'concepts'],
    examples: ['HIPAA', 'coding', 'terminology', 'protocols', 'theory']
  },
  Skills: {
    keywords: ['perform', 'operate', 'use', 'create', 'build', 'analyze'],
    examples: ['EMR entry', 'phlebotomy', 'coding', 'design', 'troubleshoot']
  },
  Abilities: {
    keywords: ['able to', 'capacity', 'can', 'capable', 'aptitude'],
    examples: ['multitask', 'lift 50lbs', 'stand 8 hours', 'type 60WPM']
  },
  Other: {
    keywords: ['certification', 'license', 'trait', 'personality', 'mindset'],
    examples: ['CMA cert', 'RN license', 'empathy', 'detail-oriented']
  }
};
```

## 📝 Example Prompts for AI Suggestions

When a user enters "customer service experience", AI responds:

> "I need to help you define what 'customer service experience' means for YOUR specific role. Let me ask a few questions:
>
> **What type of customer interactions?**
> - Phone calls about billing issues?
> - In-person patient check-ins?
> - Email support tickets?
>
> **What volume/frequency?**
> - How many customers per day?
> - Average interaction length?
> - Response time requirements?
>
> **What specific challenges?**
> - Upset customers about denials?
> - Complex technical questions?
> - Multi-tasking during busy periods?
>
> **What would success look like?**
> - Resolution rate percentage?
> - Customer satisfaction score?
> - Escalation frequency?
>
> Based on your answers, I'll help you create specific, measurable requirements that will generate meaningful interview questions."
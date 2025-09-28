# InterviewOS Major Update - Requirement Decomposition System

## 🎯 Core Problem
Users enter vague requirements like "customer service experience" and get useless questions like "Do you have customer service experience?" We need to force them to define what they ACTUALLY mean.

## 📝 To-Do List for Implementation

### Phase 1: Framework Integration
- [ ] Add interview-frameworks-knowledge.md to the project
- [ ] Create KSAO categorization system (Knowledge, Skills, Abilities, Other)
- [ ] Build vagueness detection algorithm
- [ ] Set up competency-based framework structure

### Phase 2: New Requirement Definition Step
- [ ] Add new step between requirement extraction and classification
- [ ] Create "Definition Phase" component
- [ ] Build UI for forcing users to define vague requirements
- [ ] Add "What does this mean in YOUR context?" prompts
- [ ] Implement AI suggestion button for each requirement
- [ ] Create industry-specific template suggestions

### Phase 3: Fix Mandatory/Trainable Logic
- [ ] Change classification from 3 categories to new logic:
  - Is it mandatory? (Yes/No)
  - Is it trainable? (Yes/No)  
  - Are you willing to train? (Yes/No)
- [ ] Implement rule: If Mandatory + Trainable + Willing = Not actually mandatory
- [ ] Update UI to reflect new classification logic
- [ ] Remove "Nice to have" category

### Phase 4: Smart Question Generation
- [ ] Separate certification questions (only need 1 question)
- [ ] Create STAR method question templates
- [ ] Build behavioral question generator based on KSAO type
- [ ] Implement "meaningless answer test" - reject questions that can be answered with just "yes"
- [ ] Add performance indicator questions (volume, accuracy, speed)

### Phase 5: AI Enhancement
- [ ] Create requirement decomposition prompts
- [ ] Build industry-specific suggestion engine
- [ ] Add "probing questions bank" for common requirements
- [ ] Implement smart detection of vague vs specific requirements
- [ ] Create context-aware help system

### Phase 6: UI/UX Updates
- [ ] Add tooltips explaining KSAO framework
- [ ] Create examples panel showing before/after transformations
- [ ] Add progress indicators for definition completeness
- [ ] Build help modals with industry examples
- [ ] Add "Skip definition" only for already-specific requirements

### Phase 7: Testing & Refinement
- [ ] Test with medical assistant example
- [ ] Test with customer service example
- [ ] Ensure questions are actually useful
- [ ] Verify new mandatory/trainable logic works
- [ ] Check AI suggestions are helpful

## 🔄 Workflow Changes

### Current Flow:
1. Paste job description
2. Extract requirements
3. Classify as Mandatory/Trainable/Nice-to-have
4. Generate questions

### New Flow:
1. Paste job description
2. Extract requirements
3. **NEW: Definition Phase** - Force specific definitions
4. Classify with new logic (Mandatory + Trainable questions)
5. Generate SMART behavioral questions

## 💡 Key Implementation Notes

- Requirements that are already specific (certifications, licenses, specific years) can skip definition
- Vague requirements MUST be defined before proceeding
- Each requirement should be categorized as K/S/A/O
- Questions must elicit specific, measurable responses
- No more "Do you have experience with..." questions

## 🎯 Success Criteria

- [ ] User cannot proceed with vague requirements undefined
- [ ] Generated questions reveal actual capabilities, not just "yes/no"
- [ ] Questions are specific to the user's context
- [ ] AI helps users who struggle to define requirements
- [ ] New system catches the "curse of knowledge" problem

## 📊 Example Transformation

**Before**: "Healthcare knowledge"
**After Definition**: "Must identify top 20 orthopedic medications, explain MRI results to patients, code procedures with 95% accuracy"
**Questions Generated**: "Name the three most common medications for post-op knee replacement" instead of "Do you know healthcare stuff?"
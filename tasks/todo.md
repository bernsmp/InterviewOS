# InterviewOS Build Plan

## Phase 1: Core Functionality (Today)

### Initial Setup
- [ ] Initialize git repository and commit starter files
- [ ] Review existing codebase structure
- [ ] Set up basic project configuration

### Core Components
- [ ] Create Definition Cascade component
  - [ ] Build component structure
  - [ ] Add input handling for job description
  - [ ] Extract requirements from description
  
- [ ] Add requirement classification logic
  - [ ] Create classification system (Mandatory/Trainable/Nice-to-have)
  - [ ] Build UI for manual classification
  - [ ] Add auto-suggestion logic
  
- [ ] Build question generation engine
  - [ ] Create question templates
  - [ ] Generate 40+ questions from requirements
  - [ ] Add question categorization
  
- [ ] Add the 4 Nature Discovery scripted questions
  - [ ] Define the 4 standard questions
  - [ ] Integrate into interview flow
  
- [ ] Create interview execution interface
  - [ ] Build interview screen layout
  - [ ] Add question navigation
  - [ ] Create response capture UI
  
- [ ] Add Pass/Fail/Maybe scoring system
  - [ ] Create scoring logic
  - [ ] Build scoring UI
  - [ ] Add score calculation
  
- [ ] Build PDF export for interview scripts
  - [ ] Set up PDF generation library
  - [ ] Create PDF template
  - [ ] Add export functionality

## Implementation Approach
1. Start with the simplest possible implementation for each feature
2. Focus on core functionality over UI polish
3. Test each component as we build it
4. Keep code changes minimal and focused

## Review
### Summary of changes made:
- Created TypeScript types for interview data structures
- Built Definition Cascade component for job description parsing and requirement extraction
- Implemented requirement classification with Mandatory/Trainable/Nice-to-have categories
- Created question generation engine that produces 40+ questions from requirements
- Added the 4 Nature Discovery scripted questions
- Built interview execution interface with question navigation
- Implemented Pass/Fail/Maybe scoring system
- Added PDF export functionality for interview scripts

### New dependencies added:
- jspdf (^3.0.3) - PDF generation
- html2canvas (^1.4.1) - HTML to canvas conversion (for PDF)
- @types/html2canvas (^0.5.35) - TypeScript types

### Environment variables needed:
- None required for Phase 1

### Known limitations or future improvements:
- Company name and position title are hardcoded (needs form input)
- No data persistence (Phase 2 will add Supabase)
- Basic requirement extraction algorithm (could use AI/NLP)
- PDF styling is minimal (could be enhanced)
- No interview results summary or reporting yet
# InterviewOS

A hiring diagnostic tool that transforms vague job requirements into measurable interview questions, preventing costly hiring mistakes through structured behavioral interviews.

## Features

- **AI-Powered Requirement Extraction**: Uses Gemini AI to intelligently parse job descriptions
- **40+ Targeted Questions**: Generates 6 questions per requirement plus psychological assessment questions
- **Customizable Interview Flow**: Select, edit, and reorder questions before conducting interviews
- **Real-time Scoring**: Pass/Fail/Maybe scoring with note-taking during interviews
- **Comprehensive Reports**: Download interview scripts and results as PDFs
- **Smart Categorization**: AI categorizes and organizes questions by skill type

## Tech Stack

- Next.js 15.5.3 with TypeScript
- Tailwind CSS v4 with shadcn/ui components
- Google Gemini 2.0 Flash API
- jsPDF for document generation
- @dnd-kit for drag-and-drop functionality

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/bernsmp/InterviewOS.git
cd InterviewOS
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your Gemini API key to `.env.local`:
```
GEMINI_API_KEY=your_actual_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

Visit [http://localhost:3000/interview](http://localhost:3000/interview) to start using the app.

## Deployment on Netlify

### Prerequisites
- A [Netlify](https://netlify.com) account
- A [Google AI Studio](https://makersuite.google.com/app/apikey) API key

### Deploy with Netlify Button

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/bernsmp/InterviewOS)

### Manual Deployment

1. **Fork or Clone the Repository**
   - Fork this repo to your GitHub account or clone it

2. **Connect to Netlify**
   - Log in to Netlify
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub account and select the repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18 or higher

4. **Set Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add your environment variables:
     ```
     GEMINI_API_KEY=your_gemini_api_key_here
     ```

5. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy your site automatically

### Post-Deployment

1. **Custom Domain** (optional)
   - Go to Domain Settings in Netlify
   - Add your custom domain

2. **Environment Variables**
   - Never commit your API keys to the repository
   - Always use Netlify's environment variables for sensitive data

## Usage Guide

1. **Paste Job Description**: Start by pasting your job description
2. **Review Requirements**: AI extracts 5-15 key requirements
3. **Classify Requirements**: Mark as Mandatory, Trainable, or Nice-to-have
4. **Customize Questions**: Edit, reorder, or use AI to categorize questions
5. **Select Final Questions**: Choose which questions to include in your interview
6. **Conduct Interview**: Score responses and take notes in real-time
7. **Download Results**: Export interview script or results as PDF

## Security Notes

- API keys are only used server-side
- No candidate data is stored permanently
- All processing happens in your browser and through secure API calls

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)

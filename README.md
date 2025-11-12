# Marketing Assessment Preparation Platform

A comprehensive web-based assessment platform designed for senior marketing and communications professionals preparing for job applications in the Netherlands.

## Features

### Assessment Types
- **Numerical Reasoning**: Budget allocation, ROI calculations, marketing metrics
- **Verbal Reasoning**: Campaign briefs, strategy documents, brand positioning
- **Situational Judgment**: Real-world marketing scenarios and decision-making
- **Case Studies**: Comprehensive marketing challenges with detailed scenarios
- **Technical Skills**: Marketing analytics, attribution, measurement, and tools
- **Behavioral Interview**: STAR method practice for behavioral questions
- **Logical Reasoning**: Critical thinking and problem-solving
- **Personality Assessment**: Preparation for tools like Pymetrics, DISC, Myers-Briggs

### Key Capabilities
- ✅ **105+ high-quality questions** across 8 assessment types
- ✅ **Timed practice tests** with realistic test conditions
- ✅ **Immediate feedback** with detailed explanations
- ✅ **Progress tracking** with LocalStorage persistence
- ✅ **Performance analytics** showing strengths and weaknesses
- ✅ **Personalization** by role, industry, and experience level
- ✅ **Bookmarking** difficult questions for review
- ✅ **Responsive design** works on desktop, tablet, and mobile
- ✅ **Fully client-side** - no backend required

### Marketing-Specific Content
- B2B and B2C marketing scenarios
- Budget allocation and ROI optimization
- Stakeholder management simulations
- Campaign strategy case studies
- Marketing analytics and metrics
- Netherlands market context

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand with persist middleware
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Data Persistence**: LocalStorage

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd project-1755863290635-jymdg20li
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Deployment

This application is ready to deploy to any static hosting platform:

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

Or use the Netlify UI:
1. Connect your repository
2. Build command: `npm run build`
3. Publish directory: `dist`

### GitHub Pages
```bash
npm install -g gh-pages
npm run build
gh-pages -d dist
```

## Project Structure

```
src/
├── components/
│   └── ui/              # Reusable UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Timer.tsx
│       └── ProgressBar.tsx
├── data/                # Question banks
│   ├── numericalQuestions.ts
│   ├── verbalQuestions.ts
│   ├── situationalQuestions.ts
│   ├── caseStudyQuestions.ts
│   ├── technicalQuestions.ts
│   ├── behavioralQuestions.ts
│   ├── logicalQuestions.ts
│   ├── personalityQuestions.ts
│   └── index.ts         # Question aggregation and helpers
├── pages/               # Main application pages
│   ├── Landing.tsx      # Home page with quick actions
│   ├── Assessment.tsx   # Assessment interface
│   ├── Results.tsx      # Results and analytics
│   └── Dashboard.tsx    # Progress tracking
├── stores/              # State management
│   └── useAppStore.ts   # Zustand store
├── types/               # TypeScript definitions
│   └── index.ts
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
```

## Adding New Questions

Questions are stored in TypeScript files in the `src/data/` directory. To add new questions:

1. **Choose the appropriate question file** based on type (e.g., `numericalQuestions.ts`)

2. **Add a new question object** following this structure:
```typescript
{
  id: 'unique-id',
  type: 'numerical', // or verbal, situational, etc.
  difficulty: 'mid', // entry, mid, or senior
  industry: ['General'], // optional industry tags
  question: 'Your question text here...',
  options: ['Option A', 'Option B', 'Option C', 'Option D'],
  correctAnswer: 'Option B',
  explanation: 'Brief explanation of the correct answer',
  detailedExplanation: 'Optional detailed explanation', // optional
  timeLimit: 120, // optional time limit in seconds
  resources: ['https://...'], // optional learning resources
  tags: ['roi', 'budgeting'], // searchable tags
  points: 10, // optional point value
}
```

3. **The question will automatically be included** in the question pool

## Usage Guide

### For Test-Takers

1. **Initial Setup**: On first visit, you'll set your profile (target role, industry, experience)

2. **Quick Start Options**:
   - **Random Practice**: 20 mixed questions at mid-level
   - **Full Mock Assessment**: 50 questions across all types (~60 minutes)
   - **Category Practice**: Focus on specific assessment types

3. **During Assessment**:
   - Timer shows remaining time (can be paused)
   - Progress bar shows completion status
   - Bookmark difficult questions for later review
   - Navigate between questions freely
   - Check answers to see explanations

4. **After Assessment**:
   - View detailed results and analytics
   - See which questions you got right/wrong
   - Review explanations for incorrect answers
   - Track progress over time in Dashboard

5. **Dashboard**:
   - View overall performance trends
   - Identify strong areas and areas to focus on
   - Review assessment history
   - Access bookmarked questions

### For Administrators

To customize the platform:

1. **Update questions**: Edit files in `src/data/`
2. **Modify UI**: Update components in `src/components/`
3. **Adjust styling**: Edit `tailwind.config.js` and component classes
4. **Change assessment logic**: Modify `src/stores/useAppStore.ts`

## Features Roadmap

Potential enhancements:
- [ ] Additional 100+ questions to reach 200+ total
- [ ] Downloadable study guides (PDF export)
- [ ] Company-specific assessment tips
- [ ] Salary negotiation calculator
- [ ] Interview question bank
- [ ] Spaced repetition for difficult questions
- [ ] Comparison with peer benchmarks
- [ ] Mobile app version

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Performance

- Initial load: < 2 seconds
- Smooth 60fps animations
- Optimized bundle size
- LocalStorage for instant data persistence

## Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader friendly
- High contrast ratios
- Focus indicators

## License

This project is proprietary. All rights reserved.

## Support

For questions or issues, please open an issue in the repository.

## Contributing

To contribute questions or improvements:
1. Fork the repository
2. Create a feature branch
3. Add your changes
4. Submit a pull request

## Credits

Built with:
- React + TypeScript
- Tailwind CSS
- Zustand
- Lucide React
- Vite

---

**Ready to start?** Run `npm install && npm run dev` and begin your assessment preparation journey!

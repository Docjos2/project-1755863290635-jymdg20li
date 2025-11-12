import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Brain,
  MessageSquare,
  Users,
  FileText,
  TrendingUp,
  Target,
  BookOpen,
  Play,
  Zap,
} from 'lucide-react';
import { QuestionType, DifficultyLevel, IndustryType, RoleType } from '../types';
import { useAppStore } from '../stores/useAppStore';
import { getRandomQuestions } from '../data';
import { JobList } from '../components/JobList';

interface LandingProps {
  onStartAssessment: (questions: any[], title: string) => void;
  onViewDashboard: () => void;
  onOpenQuickAnswer: () => void;
}

export const Landing: React.FC<LandingProps> = ({
  onStartAssessment,
  onViewDashboard,
  onOpenQuickAnswer,
}) => {
  const { userProfile, setUserProfile, userProgress } = useAppStore();
  const [showOnboarding, setShowOnboarding] = useState(!userProfile);

  const assessmentTypes = [
    {
      type: 'numerical' as QuestionType,
      icon: TrendingUp,
      title: 'Numerical Reasoning',
      description: 'Budget allocation, ROI, marketing metrics',
      color: 'blue',
    },
    {
      type: 'verbal' as QuestionType,
      icon: MessageSquare,
      title: 'Verbal Reasoning',
      description: 'Campaign briefs, strategy documents, positioning',
      color: 'green',
    },
    {
      type: 'situational' as QuestionType,
      icon: Users,
      title: 'Situational Judgment',
      description: 'Real marketing scenarios and decision-making',
      color: 'purple',
    },
    {
      type: 'case-study' as QuestionType,
      icon: FileText,
      title: 'Case Studies',
      description: 'Comprehensive marketing challenges',
      color: 'orange',
    },
    {
      type: 'technical' as QuestionType,
      icon: Brain,
      title: 'Technical Skills',
      description: 'Analytics, attribution, measurement',
      color: 'indigo',
    },
    {
      type: 'behavioral' as QuestionType,
      icon: Target,
      title: 'Behavioral Interview',
      description: 'STAR method practice questions',
      color: 'pink',
    },
  ];

  const handleQuickStart = () => {
    const questions = getRandomQuestions(20, { difficulty: 'mid' });
    onStartAssessment(questions, 'Quick Practice Assessment');
  };

  const handleTypeSelect = (type: QuestionType) => {
    const questions = getRandomQuestions(15, { type });
    const typeTitle = assessmentTypes.find((t) => t.type === type)?.title || type;
    onStartAssessment(questions, `${typeTitle} Practice`);
  };

  const handleFullAssessment = () => {
    const questions = getRandomQuestions(50);
    onStartAssessment(questions, 'Full Mock Assessment');
  };

  if (showOnboarding) {
    return <OnboardingFlow onComplete={() => setShowOnboarding(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Marketing Assessment Platform
              </h1>
              <p className="text-gray-600 mt-1">
                Prepare for senior marketing/communications roles in the Netherlands
              </p>
            </div>
            <Button onClick={onViewDashboard} variant="outline">
              View Progress
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Quick Actions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Start</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card hover onClick={handleQuickStart}>
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-primary-100 rounded-full mb-4">
                  <Play className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Random Practice
                </h3>
                <p className="text-gray-600 text-sm">
                  20 mixed questions, mid-level difficulty
                </p>
              </div>
            </Card>

            <Card hover onClick={handleFullAssessment}>
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-green-100 rounded-full mb-4">
                  <FileText className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Full Mock Assessment
                </h3>
                <p className="text-gray-600 text-sm">
                  50 questions across all types, ~60 minutes
                </p>
              </div>
            </Card>

            <Card hover onClick={onViewDashboard}>
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-purple-100 rounded-full mb-4">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  View Dashboard
                </h3>
                <p className="text-gray-600 text-sm">
                  Track progress and see analytics
                </p>
              </div>
            </Card>

            <Card hover onClick={onOpenQuickAnswer} className="border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-yellow-50">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-orange-100 rounded-full mb-4">
                  <Zap className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ⚡ Quick Answer
                </h3>
                <p className="text-gray-600 text-sm font-medium">
                  Get instant AI answers (&lt;10s)
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* Job Board Section */}
        <section className="mb-12">
          <JobList />
        </section>

        {/* Assessment Types */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Practice by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessmentTypes.map((assessment) => {
              const Icon = assessment.icon;
              return (
                <Card
                  key={assessment.type}
                  hover
                  onClick={() => handleTypeSelect(assessment.type)}
                >
                  <div className="flex items-start">
                    <div
                      className={`p-3 bg-${assessment.color}-100 rounded-lg mr-4`}
                    >
                      <Icon className={`w-6 h-6 text-${assessment.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {assessment.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {assessment.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Progress Overview */}
        {userProgress.completedAssessments > 0 && (
          <section className="mt-12">
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Your Progress
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-gray-600 text-sm">Assessments Completed</p>
                  <p className="text-3xl font-bold text-primary-600">
                    {userProgress.completedAssessments}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Average Score</p>
                  <p className="text-3xl font-bold text-green-600">
                    {Math.round(userProgress.averageScore)}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Strong Areas</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {userProgress.strongAreas.length || 'Building...'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Focus Areas</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {userProgress.weakAreas.length || 'None yet'}
                  </p>
                </div>
              </div>
            </Card>
          </section>
        )}
      </main>
    </div>
  );
};

// Onboarding Flow Component
const OnboardingFlow: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { setUserProfile } = useAppStore();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    targetRole: 'Marketing Manager' as RoleType,
    industry: 'General' as IndustryType,
    experienceYears: 7,
  });

  const handleSubmit = () => {
    setUserProfile({
      id: `user-${Date.now()}`,
      ...formData,
      createdAt: Date.now(),
    });
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Marketing Assessment Platform
          </h1>
          <p className="text-gray-600">
            Let's personalize your experience
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Role
            </label>
            <select
              value={formData.targetRole}
              onChange={(e) =>
                setFormData({ ...formData, targetRole: e.target.value as RoleType })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option>Marketing Manager</option>
              <option>Communications Manager</option>
              <option>Brand Manager</option>
              <option>Digital Marketing Manager</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industry Focus
            </label>
            <select
              value={formData.industry}
              onChange={(e) =>
                setFormData({ ...formData, industry: e.target.value as IndustryType })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option>General</option>
              <option>Retail</option>
              <option>FMCG</option>
              <option>B2B Services</option>
              <option>Tech</option>
              <option>Healthcare</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Years of Experience: {formData.experienceYears}
            </label>
            <input
              type="range"
              min="5"
              max="15"
              value={formData.experienceYears}
              onChange={(e) =>
                setFormData({ ...formData, experienceYears: parseInt(e.target.value) })
              }
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5 years</span>
              <span>15 years</span>
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full" size="lg">
            Get Started
          </Button>
        </div>
      </Card>
    </div>
  );
};

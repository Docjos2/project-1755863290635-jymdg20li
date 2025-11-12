import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AssessmentSession } from '../types';
import {
  CheckCircle,
  XCircle,
  TrendingUp,
  Clock,
  Target,
  Award,
  Home,
  RotateCcw,
} from 'lucide-react';

interface ResultsProps {
  session: AssessmentSession;
  onReturnHome: () => void;
  onRetry: () => void;
}

export const Results: React.FC<ResultsProps> = ({
  session,
  onReturnHome,
  onRetry,
}) => {
  const { score, totalQuestions, results } = session;
  const correctCount = results.filter((r) => r.isCorrect).length;
  const incorrectCount = results.filter((r) => !r.isCorrect).length;
  const percentile = calculatePercentile(score);

  const timeSpent = session.endTime
    ? Math.round((session.endTime - session.startTime) / 1000 / 60)
    : 0;

  const performanceLevel =
    score >= 80 ? 'excellent' : score >= 60 ? 'good' : score >= 40 ? 'fair' : 'needs-improvement';

  const performanceColors = {
    excellent: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    good: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    fair: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
    'needs-improvement': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  };

  const colors = performanceColors[performanceLevel];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Assessment Results</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Score Overview */}
        <Card className={`mb-8 ${colors.bg} border-2 ${colors.border}`}>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-4 shadow-md">
              <span className={`text-4xl font-bold ${colors.text}`}>
                {Math.round(score)}%
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {performanceLevel === 'excellent' && 'Excellent Performance!'}
              {performanceLevel === 'good' && 'Good Job!'}
              {performanceLevel === 'fair' && 'Fair Performance'}
              {performanceLevel === 'needs-improvement' && 'Keep Practicing'}
            </h2>
            <p className="text-gray-600">
              You scored better than approximately {percentile}% of test-takers
            </p>
          </div>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Correct</p>
                <p className="text-2xl font-bold text-gray-900">{correctCount}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg mr-4">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Incorrect</p>
                <p className="text-2xl font-bold text-gray-900">{incorrectCount}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Time Spent</p>
                <p className="text-2xl font-bold text-gray-900">{timeSpent}m</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg mr-4">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Accuracy</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round((correctCount / totalQuestions) * 100)}%
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Performance Insights */}
        <Card className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Performance Insights</h3>
          <div className="space-y-4">
            {score >= 80 && (
              <div className="flex items-start">
                <Award className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Strong Performance</p>
                  <p className="text-sm text-gray-600">
                    You demonstrated excellent understanding of the material. Continue
                    practicing to maintain this level.
                  </p>
                </div>
              </div>
            )}

            {score >= 60 && score < 80 && (
              <div className="flex items-start">
                <TrendingUp className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Good Progress</p>
                  <p className="text-sm text-gray-600">
                    You have a solid foundation. Focus on the areas where you struggled to
                    push your score higher.
                  </p>
                </div>
              </div>
            )}

            {score < 60 && (
              <div className="flex items-start">
                <Target className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Room for Improvement</p>
                  <p className="text-sm text-gray-600">
                    Keep practicing! Review the explanations for incorrect answers and focus
                    on understanding the concepts.
                  </p>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Recommended Next Steps</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
                  Review questions you got wrong and understand the explanations
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
                  Practice similar question types to reinforce learning
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
                  Try a full mock assessment to simulate real test conditions
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Question Breakdown */}
        <Card className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Question Breakdown</h3>
          <div className="space-y-3">
            {results.map((result, index) => (
              <div
                key={result.questionId}
                className={`p-4 rounded-lg border-2 ${
                  result.isCorrect
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {result.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mr-3" />
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">
                        Question {index + 1}
                      </p>
                      <p className="text-sm text-gray-600">
                        Your answer: {result.userAnswer || 'Not answered'}
                      </p>
                      {!result.isCorrect && (
                        <p className="text-sm text-gray-600">
                          Correct answer: {result.correctAnswer}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Button onClick={onReturnHome} variant="outline" size="lg">
            <Home className="w-4 h-4 mr-2" />
            Return Home
          </Button>
          <Button onClick={onRetry} size="lg">
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </main>
    </div>
  );
};

// Helper function to calculate percentile (mock calculation)
function calculatePercentile(score: number): number {
  // This is a simplified percentile calculation
  // In a real application, this would be based on actual user data
  if (score >= 90) return 95;
  if (score >= 80) return 85;
  if (score >= 70) return 70;
  if (score >= 60) return 55;
  if (score >= 50) return 40;
  return 25;
}

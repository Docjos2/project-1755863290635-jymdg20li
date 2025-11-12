import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAppStore } from '../stores/useAppStore';
import {
  TrendingUp,
  TrendingDown,
  Award,
  BookOpen,
  Home,
  BarChart3,
} from 'lucide-react';

interface DashboardProps {
  onReturnHome: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onReturnHome }) => {
  const { userProgress, userProfile } = useAppStore();

  const recentSessions = userProgress.assessmentHistory.slice(-5).reverse();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Track your progress and identify areas for improvement
              </p>
            </div>
            <Button onClick={onReturnHome} variant="outline">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Profile Overview */}
        {userProfile && (
          <Card className="mb-8 bg-gradient-to-r from-primary-50 to-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {userProfile.targetRole}
                </h2>
                <p className="text-gray-600">
                  {userProfile.industry} • {userProfile.experienceYears} years experience
                </p>
              </div>
              <Award className="w-12 h-12 text-primary-600" />
            </div>
          </Card>
        )}

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Assessments Completed</p>
                <p className="text-3xl font-bold text-gray-900">
                  {userProgress.completedAssessments}
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-primary-600" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Score</p>
                <p className="text-3xl font-bold text-green-600">
                  {Math.round(userProgress.averageScore)}%
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Strong Areas</p>
                <p className="text-3xl font-bold text-blue-600">
                  {userProgress.strongAreas.length}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Focus Areas</p>
                <p className="text-3xl font-bold text-orange-600">
                  {userProgress.weakAreas.length}
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-orange-600" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Strong Areas */}
          <Card>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
              Your Strong Areas
            </h3>
            {userProgress.strongAreas.length > 0 ? (
              <ul className="space-y-2">
                {userProgress.strongAreas.map((area) => (
                  <li
                    key={area}
                    className="flex items-center p-3 bg-green-50 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                    <span className="text-gray-900 capitalize">
                      {area.replace('-', ' ')}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 text-sm">
                Complete more assessments to identify your strong areas
              </p>
            )}
          </Card>

          {/* Focus Areas */}
          <Card>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <TrendingDown className="w-5 h-5 text-orange-600 mr-2" />
              Areas to Focus On
            </h3>
            {userProgress.weakAreas.length > 0 ? (
              <ul className="space-y-2">
                {userProgress.weakAreas.map((area) => (
                  <li
                    key={area}
                    className="flex items-center p-3 bg-orange-50 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-orange-600 rounded-full mr-3"></div>
                    <span className="text-gray-900 capitalize">
                      {area.replace('-', ' ')}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 text-sm">
                Great job! No weak areas identified yet. Keep practicing!
              </p>
            )}
          </Card>
        </div>

        {/* Recent Assessments */}
        <Card>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Assessments</h3>
          {recentSessions.length > 0 ? (
            <div className="space-y-3">
              {recentSessions.map((session) => {
                const date = new Date(session.startTime);
                return (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-gray-900 capitalize">
                        {session.type.replace('-', ' ')} Assessment
                      </p>
                      <p className="text-sm text-gray-600">
                        {date.toLocaleDateString()} • {date.toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary-600">
                        {Math.round(session.score)}%
                      </p>
                      <p className="text-sm text-gray-600">
                        {session.results.filter((r) => r.isCorrect).length}/
                        {session.totalQuestions} correct
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No assessments completed yet</p>
              <Button onClick={onReturnHome} className="mt-4">
                Start Your First Assessment
              </Button>
            </div>
          )}
        </Card>

        {/* Bookmarked Questions */}
        {userProgress.bookmarkedQuestions.length > 0 && (
          <Card className="mt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Bookmarked Questions ({userProgress.bookmarkedQuestions.length})
            </h3>
            <p className="text-gray-600 text-sm">
              You have {userProgress.bookmarkedQuestions.length} question(s) bookmarked
              for review. Practice these questions to reinforce your learning.
            </p>
          </Card>
        )}
      </main>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Landing } from './pages/Landing';
import { Assessment } from './pages/Assessment';
import { Results } from './pages/Results';
import { Dashboard } from './pages/Dashboard';
import { QuickAnswer } from './pages/QuickAnswer';
import LoginPage from './components/auth/LoginPage';
import { useAppStore } from './stores/useAppStore';
import { useAuth } from './contexts/AuthContext';
import { Question } from './types';

type Page = 'landing' | 'assessment' | 'results' | 'dashboard' | 'quick-answer';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [assessmentTitle, setAssessmentTitle] = useState('');

  const { user, loading } = useAuth();
  const { finishAssessment, resetAssessment, loadUserData } = useAppStore();

  // Load user data when authenticated
  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user, loadUserData]);

  const handleStartAssessment = (questions: Question[], title: string) => {
    setCurrentQuestions(questions);
    setAssessmentTitle(title);
    resetAssessment();
    useAppStore.getState().startAssessment(questions);
    setCurrentPage('assessment');
  };

  const handleCompleteAssessment = () => {
    const session = finishAssessment();
    setCurrentPage('results');
  };

  const handleReturnHome = () => {
    setCurrentPage('landing');
  };

  const handleViewDashboard = () => {
    setCurrentPage('dashboard');
  };

  const handleOpenQuickAnswer = () => {
    setCurrentPage('quick-answer');
  };

  const handleRetry = () => {
    resetAssessment();
    useAppStore.getState().startAssessment(currentQuestions);
    setCurrentPage('assessment');
  };

  const handleExit = () => {
    const confirmed = window.confirm(
      'Are you sure you want to exit? Your progress will be lost.'
    );
    if (confirmed) {
      resetAssessment();
      setCurrentPage('landing');
    }
  };

  // Get the latest session for results page
  const latestSession = useAppStore.getState().userProgress.assessmentHistory[
    useAppStore.getState().userProgress.assessmentHistory.length - 1
  ];

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!user) {
    return <LoginPage />;
  }

  return (
    <>
      {currentPage === 'landing' && (
        <Landing
          onStartAssessment={handleStartAssessment}
          onViewDashboard={handleViewDashboard}
          onOpenQuickAnswer={handleOpenQuickAnswer}
        />
      )}

      {currentPage === 'assessment' && currentQuestions.length > 0 && (
        <Assessment
          questions={currentQuestions}
          title={assessmentTitle}
          onComplete={handleCompleteAssessment}
          onExit={handleExit}
        />
      )}

      {currentPage === 'results' && latestSession && (
        <Results
          session={latestSession}
          onReturnHome={handleReturnHome}
          onRetry={handleRetry}
        />
      )}

      {currentPage === 'dashboard' && (
        <Dashboard onReturnHome={handleReturnHome} />
      )}

      {currentPage === 'quick-answer' && (
        <QuickAnswer onClose={handleReturnHome} />
      )}
    </>
  );
}

export default App;

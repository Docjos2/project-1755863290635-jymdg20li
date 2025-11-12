import React, { useState } from 'react';
import { Landing } from './pages/Landing';
import { Assessment } from './pages/Assessment';
import { Results } from './pages/Results';
import { Dashboard } from './pages/Dashboard';
import { useAppStore } from './stores/useAppStore';
import { Question } from './types';

type Page = 'landing' | 'assessment' | 'results' | 'dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [assessmentTitle, setAssessmentTitle] = useState('');

  const { finishAssessment, resetAssessment } = useAppStore();

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

  return (
    <>
      {currentPage === 'landing' && (
        <Landing
          onStartAssessment={handleStartAssessment}
          onViewDashboard={handleViewDashboard}
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
    </>
  );
}

export default App;

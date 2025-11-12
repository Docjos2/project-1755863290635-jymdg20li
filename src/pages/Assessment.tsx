import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Timer } from '../components/ui/Timer';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useAppStore } from '../stores/useAppStore';
import { Question } from '../types';
import {
  ChevronLeft,
  ChevronRight,
  Flag,
  CheckCircle,
  BookmarkPlus,
  BookmarkCheck,
} from 'lucide-react';

interface AssessmentProps {
  questions: Question[];
  title: string;
  onComplete: () => void;
  onExit: () => void;
}

export const Assessment: React.FC<AssessmentProps> = ({
  questions,
  title,
  onComplete,
  onExit,
}) => {
  const {
    currentAssessment,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    toggleTimer,
    userProgress,
    bookmarkQuestion,
    unbookmarkQuestion,
  } = useAppStore();

  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number>('');

  const currentQuestion = questions[currentAssessment.currentQuestionIndex];
  const isBookmarked = userProgress.bookmarkedQuestions.includes(currentQuestion?.id);
  const hasAnswer = currentAssessment.answers[currentQuestion?.id] !== undefined;

  useEffect(() => {
    // Load saved answer if exists
    if (currentQuestion) {
      const savedAnswer = currentAssessment.answers[currentQuestion.id];
      setSelectedAnswer(savedAnswer || '');
      setShowExplanation(false);
    }
  }, [currentAssessment.currentQuestionIndex, currentQuestion, currentAssessment.answers]);

  const handleAnswerSelect = (answer: string | number) => {
    setSelectedAnswer(answer);
    if (currentQuestion) {
      submitAnswer(currentQuestion.id, answer);
    }
  };

  const handleNext = () => {
    if (currentAssessment.currentQuestionIndex < questions.length - 1) {
      nextQuestion();
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentAssessment.currentQuestionIndex > 0) {
      previousQuestion();
    }
  };

  const handleToggleBookmark = () => {
    if (currentQuestion) {
      if (isBookmarked) {
        unbookmarkQuestion(currentQuestion.id);
      } else {
        bookmarkQuestion(currentQuestion.id);
      }
    }
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <p className="text-gray-600">Loading questions...</p>
        </Card>
      </div>
    );
  }

  const progress = {
    answered: Object.keys(currentAssessment.answers).length,
    total: questions.length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span>
                  {progress.answered} of {progress.total} answered
                </span>
                <span className="text-gray-300">|</span>
                <span className="capitalize">{currentQuestion.type}</span>
                <span className="text-gray-300">|</span>
                <span className="capitalize">{currentQuestion.difficulty}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {currentQuestion.timeLimit && (
                <Timer
                  initialSeconds={currentQuestion.timeLimit}
                  isPaused={!currentAssessment.isTimerActive}
                  onTogglePause={toggleTimer}
                  onTimeUp={() => {
                    // Auto-submit or warn user
                  }}
                />
              )}
              <Button onClick={onExit} variant="ghost" size="sm">
                Exit
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <ProgressBar
              current={currentAssessment.currentQuestionIndex + 1}
              total={questions.length}
            />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Question Card */}
          <Card>
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Question {currentAssessment.currentQuestionIndex + 1}
              </h2>
              <button
                onClick={handleToggleBookmark}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="w-5 h-5 text-primary-600" />
                ) : (
                  <BookmarkPlus className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>

            <div className="prose prose-lg max-w-none mb-6">
              <p className="whitespace-pre-wrap text-gray-700">
                {currentQuestion.question}
              </p>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQuestion.options?.map((option, index) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === currentQuestion.correctAnswer;
                const showCorrectness = showExplanation;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? showCorrectness
                          ? isCorrect
                            ? 'border-green-500 bg-green-50'
                            : 'border-red-500 bg-red-50'
                          : 'border-primary-500 bg-primary-50'
                        : showCorrectness && isCorrect
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="flex-1">{option}</span>
                      {showCorrectness && isSelected && !isCorrect && (
                        <span className="text-red-600 text-sm">Incorrect</span>
                      )}
                      {showCorrectness && isCorrect && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Check Answer / Explanation */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              {!showExplanation && selectedAnswer && (
                <Button
                  onClick={() => setShowExplanation(true)}
                  variant="secondary"
                  className="w-full"
                >
                  Check Answer
                </Button>
              )}

              {showExplanation && (
                <div className="space-y-4">
                  <div
                    className={`p-4 rounded-lg ${
                      selectedAnswer === currentQuestion.correctAnswer
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    <p className="font-semibold mb-2">
                      {selectedAnswer === currentQuestion.correctAnswer
                        ? 'Correct!'
                        : 'Incorrect'}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Correct answer:</strong> {currentQuestion.correctAnswer}
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Explanation</h3>
                    <p className="text-gray-700 text-sm">
                      {currentQuestion.explanation}
                    </p>
                    {currentQuestion.detailedExplanation && (
                      <>
                        <h4 className="font-semibold text-gray-900 mt-4 mb-2">
                          Detailed Explanation
                        </h4>
                        <p className="text-gray-700 text-sm">
                          {currentQuestion.detailedExplanation}
                        </p>
                      </>
                    )}
                  </div>

                  {currentQuestion.resources && currentQuestion.resources.length > 0 && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Learning Resources
                      </h3>
                      <ul className="space-y-1">
                        {currentQuestion.resources.map((resource, idx) => (
                          <li key={idx} className="text-sm text-primary-600">
                            <a href={resource} target="_blank" rel="noopener noreferrer">
                              {resource}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              onClick={handlePrevious}
              disabled={currentAssessment.currentQuestionIndex === 0}
              variant="outline"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {hasAnswer && (
                <span title="Answered">
                  <Flag className="w-5 h-5 text-green-600" />
                </span>
              )}
            </div>

            <Button onClick={handleNext}>
              {currentAssessment.currentQuestionIndex === questions.length - 1
                ? 'Finish Assessment'
                : 'Next'}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {/* Question Navigator */}
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Question Navigator</h3>
            <div className="grid grid-cols-10 gap-2">
              {questions.map((q, idx) => {
                const answered = currentAssessment.answers[q.id] !== undefined;
                const isCurrent = idx === currentAssessment.currentQuestionIndex;

                return (
                  <button
                    key={q.id}
                    onClick={() => goToQuestion(idx)}
                    className={`aspect-square rounded-lg text-sm font-medium transition-colors ${
                      isCurrent
                        ? 'bg-primary-600 text-white'
                        : answered
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

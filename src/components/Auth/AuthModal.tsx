import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultView = 'login',
}) => {
  const [view, setView] = useState<'login' | 'signup'>(defaultView);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="relative w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        {view === 'login' ? (
          <LoginForm
            onSwitchToSignUp={() => setView('signup')}
            onSuccess={onClose}
          />
        ) : (
          <SignUpForm
            onSwitchToLogin={() => setView('login')}
            onSuccess={onClose}
          />
        )}
      </div>
    </div>
  );
};

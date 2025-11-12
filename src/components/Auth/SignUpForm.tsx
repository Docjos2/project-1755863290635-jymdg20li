import React, { useState } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface SignUpFormProps {
  onSwitchToLogin: () => void;
  onSuccess?: () => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ onSwitchToLogin, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    const { error: signUpError } = await signUp(email, password, fullName);

    if (signUpError) {
      setError(signUpError.message || 'Failed to sign up');
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    }
  };

  if (success) {
    return (
      <Card className="max-w-md mx-auto p-6">
        <div className="text-center">
          <div className="mb-4 text-green-600 text-5xl">✓</div>
          <h2 className="text-2xl font-bold mb-4">Account Created!</h2>
          <p className="text-gray-600 mb-4">
            Welcome to Marketing Assessment Platform. Your account has been created successfully.
          </p>
          <p className="text-sm text-gray-500">
            You can now start tracking your progress across all devices.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium mb-2">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="••••••••"
          />
          <p className="text-xs text-gray-500 mt-1">
            Must be at least 6 characters long
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign In
          </button>
        </p>
      </div>
    </Card>
  );
};

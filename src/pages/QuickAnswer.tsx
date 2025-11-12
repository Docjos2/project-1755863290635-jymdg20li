import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Zap, Settings, Copy, CheckCircle, Loader2, X } from 'lucide-react';

interface QuickAnswerProps {
  onClose?: () => void;
}

export const QuickAnswer: React.FC<QuickAnswerProps> = ({ onClose }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [context, setContext] = useState('');
  const [answer, setAnswer] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('anthropic-api-key') || '');
  const [showSettings, setShowSettings] = useState(!apiKey);
  const [copied, setCopied] = useState(false);
  const questionInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Focus on question input when component loads
    questionInputRef.current?.focus();
  }, []);

  useEffect(() => {
    // Save API key to localStorage when it changes
    if (apiKey) {
      localStorage.setItem('anthropic-api-key', apiKey);
    }
  }, [apiKey]);

  const handleGetAnswer = async () => {
    if (!question.trim()) {
      alert('Please enter a question');
      return;
    }

    if (!apiKey) {
      setShowSettings(true);
      alert('Please add your Anthropic API key in settings');
      return;
    }

    setIsLoading(true);
    setAnswer('');
    setExplanation('');

    try {
      const response = await fetch('/api/quick-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          options: options.filter(o => o.trim()),
          context,
          apiKey,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get answer');
      }

      const data = await response.json();
      setAnswer(data.answer);
      setExplanation(data.explanation);
    } catch (error) {
      console.error('Error:', error);
      // Fallback to client-side Claude API call
      try {
        const result = await getAnswerFromClaude(question, options.filter(o => o.trim()), context, apiKey);
        setAnswer(result.answer);
        setExplanation(result.explanation);
      } catch (fallbackError) {
        alert('Error getting answer. Please check your API key and try again.');
        console.error('Fallback error:', fallbackError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyAnswer = () => {
    navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setQuestion('');
    setOptions(['', '', '', '']);
    setContext('');
    setAnswer('');
    setExplanation('');
    questionInputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    // Ctrl/Cmd + Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleGetAnswer();
    }
  };

  if (showSettings) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">API Settings</h2>
              {apiKey && (
                <Button onClick={() => setShowSettings(false)} variant="ghost" size="sm">
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anthropic API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-ant-..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Get your API key from{' '}
                  <a
                    href="https://console.anthropic.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline"
                  >
                    console.anthropic.com
                  </a>
                </p>
              </div>

              <Button onClick={() => setShowSettings(false)} disabled={!apiKey} className="w-full">
                Save & Continue
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">Quick Answer</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => setShowSettings(true)} variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              {onClose && (
                <Button onClick={onClose} variant="outline" size="sm">
                  Close
                </Button>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Paste your question and get instant AI-powered answers • Press Ctrl+Enter to submit
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <Card>
              <h3 className="font-semibold text-gray-900 mb-3">Question</h3>
              <textarea
                ref={questionInputRef}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Paste the question here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={6}
              />
            </Card>

            <Card>
              <h3 className="font-semibold text-gray-900 mb-3">Answer Options (Optional)</h3>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <input
                    key={index}
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...options];
                      newOptions[index] = e.target.value;
                      setOptions(newOptions);
                    }}
                    onKeyDown={handleKeyPress}
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold text-gray-900 mb-3">Context (Optional)</h3>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Add any additional context, data tables, or background info..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={3}
              />
            </Card>

            <div className="flex gap-3">
              <Button
                onClick={handleGetAnswer}
                disabled={isLoading || !question.trim()}
                className="flex-1"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Get Answer (Ctrl+Enter)
                  </>
                )}
              </Button>
              <Button onClick={handleReset} variant="outline" size="lg">
                Reset
              </Button>
            </div>
          </div>

          {/* Answer Section */}
          <div className="space-y-4">
            {answer ? (
              <>
                <Card className="bg-green-50 border-green-200">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-green-900 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Answer
                    </h3>
                    <Button onClick={handleCopyAnswer} variant="ghost" size="sm">
                      {copied ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-2xl font-bold text-green-900">{answer}</p>
                </Card>

                {explanation && (
                  <Card>
                    <h3 className="font-semibold text-gray-900 mb-3">Explanation</h3>
                    <div className="prose prose-sm max-w-none text-gray-700">
                      <p className="whitespace-pre-wrap">{explanation}</p>
                    </div>
                  </Card>
                )}
              </>
            ) : (
              <Card className="bg-gray-50">
                <div className="text-center py-12">
                  <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Ready to Help
                  </h3>
                  <p className="text-gray-600">
                    Enter your question and click "Get Answer" or press Ctrl+Enter
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

// Client-side Claude API integration
async function getAnswerFromClaude(
  question: string,
  options: string[],
  context: string,
  apiKey: string
): Promise<{ answer: string; explanation: string }> {
  const Anthropic = (await import('@anthropic-ai/sdk')).default;

  const client = new Anthropic({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true, // Note: In production, use a backend proxy
  });

  const hasOptions = options.length > 0;

  const prompt = `You are an expert in marketing, communications, and business strategy. Analyze this question and provide the correct answer.

Question:
${question}

${hasOptions ? `Answer Options:\n${options.map((opt, i) => `${String.fromCharCode(65 + i)}) ${opt}`).join('\n')}` : ''}

${context ? `Additional Context:\n${context}` : ''}

Provide:
1. The correct answer ${hasOptions ? '(letter and full text)' : ''}
2. A brief explanation (2-3 sentences max) of why this is correct

Format your response as:
ANSWER: [your answer]
EXPLANATION: [your explanation]`;

  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

  // Parse the response
  const answerMatch = responseText.match(/ANSWER:\s*(.+?)(?:\n|$)/i);
  const explanationMatch = responseText.match(/EXPLANATION:\s*(.+)/is);

  return {
    answer: answerMatch?.[1]?.trim() || 'Unable to determine answer',
    explanation: explanationMatch?.[1]?.trim() || responseText,
  };
}

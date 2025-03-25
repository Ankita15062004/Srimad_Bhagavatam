import React, { useState } from 'react';
import { BookOpen, Loader2, ScrollText } from 'lucide-react';

function App() {
  const [verse, setVerse] = useState('');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getExplanation = async () => {
    if (!verse.trim()) {
      setError('Please enter a verse reference');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-002:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are a knowledgeable scholar of Vedic literature, specifically the Srimad Bhagavatam. Please provide a clear, concise explanation of this Srimad Bhagavatam verse reference while maintaining the spiritual essence: ${verse}`
              }]
            }]
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get response from Gemini API');
      }

      const data = await response.json();
      setExplanation(data.candidates[0].content.parts[0].text || '');
    } catch (err) {
      setError('Failed to get explanation. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-10 w-10 text-orange-600" />
            <h1 className="text-4xl font-bold text-gray-800">Vedabase AI Explainer</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enter a Srimad Bhagavatam verse reference (e.g., "SB 1.1.1") to receive a simplified explanation
            powered by AI.
          </p>
        </header>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex gap-4">
              <input
                type="text"
                value={verse}
                onChange={(e) => setVerse(e.target.value)}
                placeholder="Enter verse reference (e.g., SB 1.1.1)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
              <button
                onClick={getExplanation}
                disabled={loading}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:bg-orange-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ScrollText className="h-5 w-5" />
                    Explain
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {explanation && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Explanation:</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {explanation}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>Data sourced from vedabase.io</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
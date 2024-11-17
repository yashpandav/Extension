import React from 'react';
import { useState , useEffect } from 'react';
import { Quote as QuoteIcon } from 'lucide-react';

export const Quote = () => {
  const [quote, setQuote] = useState<{ text: string; author: string }>();

  useEffect(() => {
    // Mock quote (replace with actual API call)
    setQuote({
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs"
    });
  }, []);

  if (!quote) return null;

  return (
    <div className="bg-white/30 backdrop-blur-md rounded-xl p-4 shadow-lg max-w-md">
      <div className="flex gap-3">
        <QuoteIcon className="w-8 h-8 text-gray-600 flex-shrink-0" />
        <div>
          <p className="text-lg font-medium">{quote.text}</p>
          <p className="text-sm text-gray-600 mt-2">— {quote.author}</p>
        </div>
      </div>
    </div>
  );
};
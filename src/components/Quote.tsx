import React, { useState, useEffect } from "react";
import { Quote as QuoteIcon, RefreshCcw as RefreshIcon, AlertTriangle } from "lucide-react";

export const Quote = () => {
  const [quote, setQuote] = useState<{ text: string; author: string } | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuote = async () => {
    setLoading(true);
    setError(null);

    const category = "happiness";
    const apiUrl = `https://api.api-ninjas.com/v1/quotes?category=${category}`;
    const QUOTES_API_KEY = import.meta.env.VITE_QUOTES_API_KEY;

    try {
      const response = await fetch(apiUrl, {
        headers: { "X-Api-Key": QUOTES_API_KEY },
      });

      const data = await response.json();
      if (response.ok && data.length > 0) {
        setQuote({
          text: data[0].quote,
          author: data[0].author,
        });
      } else {
        setError("No quote found.");
      }
    } catch (error) {
      setError("Failed to fetch quote. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  const handleRefresh = () => {
    fetchQuote();
  };

  if (error) {
    return (
      <div className="relative">
        <div className="relative backdrop-blur-xl bg-red-100 border border-red-300 rounded-2xl p-6 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-transparent rounded-2xl"></div>
          <div className="relative flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <span className="font-semibold text-red-700">{error}</span>
          </div>
          <button
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-white via-gray-100 to-gray-200 rounded-xl h-auto p-4 shadow-lg max-w-md border border-gray-300">
      <div className="flex gap-3">
        <QuoteIcon className="w-8 h-8 text-gray-600 flex-shrink-0" />
        <div>
          {loading ? (
            <p className="text-lg font-medium text-gray-500">
              {
                [
                  "Quote is on its way... 📜",
                  "Just a moment, fetching your quote... ⏳",
                  "Hold tight, wisdom incoming... 💭",
                  "Searching for the perfect quote... 🔍",
                  "One second, finding your inspiration... ✨",
                ][Math.floor(Math.random() * 5)]
              }
            </p>
          ) : (
            <>
              <p className="text-lg font-medium text-gray-800">{quote?.text}</p>
              <p className="text-sm text-gray-600 mt-2">— {quote?.author}</p>
            </>
          )}
        </div>
      </div >
      <div
        className="mt-4 p-2 rounded-full flex justify-end items-center"
      >
        <RefreshIcon
          onClick={handleRefresh}
          className={`w-6 h-6 text-gray-600 cursor-pointer ${loading ? "animate-spin" : ""} hover:text-gray-700 transition-colors`}
        />
      </div>
    </div >
  );
};

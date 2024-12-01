import React, { useState, useEffect } from 'react';
import { Newspaper, RefreshCw, Globe, AlertTriangle } from 'lucide-react';

interface Article {
  title: string;
  description: string;
  url: string;
  source: { name: string };
}

interface NewsResponse {
  articles: Article[];
}

const API_KEYS = [
  import.meta.env.VITE_NEWS_API_KEY_1,
  import.meta.env.VITE_NEWS_API_KEY_2,
  import.meta.env.VITE_NEWS_API_KEY_3,
];

export const News: React.FC = () => {
  const [news, setNews] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('general');

  const categories = [
    { id: 'general', label: 'General' },
    { id: 'technology', label: 'Tech' },
    { id: 'business', label: 'Business' },
    { id: 'science', label: 'Science' }
  ];

  const fetchNews = async (keyIndex: number = 0, category: string = activeCategory) => {
    if (keyIndex >= API_KEYS.length) {
      setError('Unable to fetch news at the moment.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://gnews.io/api/v4/top-headlines?category=${category}&token=${API_KEYS[keyIndex]}&lang=en`
      );

      if (!response.ok) throw new Error('Failed to fetch news');

      const data: NewsResponse = await response.json();
      if (data.articles?.length) {
        const shuffledArticles = data.articles.sort(() => Math.random() - 0.5);
        setNews(shuffledArticles.slice(0, 8));
      } else {
        throw new Error('No articles found');
      }
    } catch (err) {
      console.error(`API key index ${keyIndex} failed:`, err);
      fetchNews(keyIndex + 1, category);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => fetchNews(0);

  useEffect(() => {
    fetchNews(0);
  }, [activeCategory]);

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
    );
  }

  return (
    <div className="relative">
      {/* Main Card */}
      <div className="relative backdrop-blur-xl bg-white/10 rounded-2xl p-6 shadow-md border border-white/30 overflow-hidden hover:shadow-lg transition-all duration-300">

        {/* Blur Effects */}
        <div className="absolute -top-3 -right-3 w-16 h-16 bg-indigo-400/20 rounded-full blur-lg"></div>
        <div className="absolute -bottom-3 -left-3 w-16 h-16 bg-blue-400/20 rounded-full blur-lg"></div>

        <div className="relative space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-gray-900" />
              <h2 className="text-xl font-semibold text-gray-900">Latest News</h2>
            </div>
            <button
              onClick={handleRefresh}
              className="text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-gray-800/20"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Categories */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 
                  ${activeCategory === category.id
                    ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 text-white shadow-lg'
                    : 'bg-gray-800 text-white hover:bg-gradient-to-r hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-500 hover:text-white'
                  }`}
              >
                {/* Decorative Glow */}
                {activeCategory === category.id && (
                  <div className="absolute inset-0 rounded-full blur-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-30"></div>
                )}
                <span className="relative z-10">{category.label}</span>
              </button>
            ))}
          </div>

          {/* News Content */}
          <div className="space-y-2">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse flex flex-col gap-2 p-4"
                  >
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {news.slice(0, 5).map((article, index) => (
                  <div
                    key={index}
                    className="group relative p-4 cursor-pointer transition-all duration-200"
                    onClick={() => window.open(article.url, '_blank')}
                  >
                    {/* Article Title */}
                    <h3 className="font-bold text-white group-hover:text-indigo-500 transition-colors text-lg">
                      {article.title}
                    </h3>

                    {/* Source and Description */}
                    <div className="mt-2 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-indigo-500" />
                      <span className="text-sm text-white">{article.source.name}</span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-white group-hover:text-gray-200 line-clamp-2 mt-2">
                      {article.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;

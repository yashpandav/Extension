import React from 'react';
import { Newspaper } from 'lucide-react';

export const News = () => {
  const [news, setNews] = React.useState<any[]>([]);

  React.useEffect(() => {
    setNews([
      {
        id: 1,
        title: 'Major Scientific Breakthrough in Quantum Computing',
        source: 'Tech Daily',
        url: '#'
      },
      {
        id: 2,
        title: 'Global Climate Summit Reaches Historic Agreement',
        source: 'World News',
        url: '#'
      },
      {
        id: 3,
        title: 'Revolutionary AI Model Shows Human-Like Understanding',
        source: 'Science Weekly',
        url: '#'
      }
    ]);
  }, []);
  return (  
    <div className="bg-white/30 backdrop-blur-md rounded-xl p-4 shadow-lg w-full max-w-md">
      <div className="flex items-center gap-2 mb-4">
        <Newspaper className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Latest News</h2>
      </div>
      <div className="space-y-3">
        {news.map(item => (
          <a
            key={item.id}
            href={item.url}
            className="block p-3 rounded-lg hover:bg-white/20 transition-colors"
          >
            <h3 className="font-medium">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.source}</p>
          </a>
        ))}
      </div>
    </div>
  );
};
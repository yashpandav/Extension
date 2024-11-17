import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Search } from './components/Search';
import { Weather } from './components/Weather';
import { TodoList } from './components/TodoList';
import { News } from './components/News';
import { Quote } from './components/Quote';
import { TopSites } from './components/TopSites';

const getTimeBasedBackground = (): string => {
  const hour = new Date().getHours();
  if (hour < 6) return 'https://images.unsplash.com/photo-1519681393784-d120267933ba'; // Night
  if (hour < 12) return 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8'; // Morning
  if (hour < 18) return 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05'; // Afternoon
  return 'https://images.unsplash.com/photo-1472120435266-53107fd0c44a'; // Evening
};

function App() {
  const [time, setTime] = useState<Date>(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${getTimeBasedBackground()})` }}
    >
      <div className="min-h-screen bg-black/30 backdrop-blur-[2px]">
        <div className="container mx-auto py-8 px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-7xl font-bold text-white mb-3 tracking-tight">
              {format(time, 'HH:mm')}
            </h1>
            <p className="text-2xl text-white/90 font-light">
              {format(time, 'EEEE, MMMM do, yyyy')}
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-12">
            <Search />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            <Weather />
            <Quote />
            <TodoList />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <TopSites />
            <News />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
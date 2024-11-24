import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Search } from "./components/Search";
import { Weather } from "./components/Weather";
import TodoList from "./components/TodoList";
import { News } from "./components/News";
import { Quote } from "./components/Quote";
import { TopSites } from "./components/TopSites";

const getTimeBasedBackground = (): string => {
  const hour = new Date().getHours();

  if (hour < 6)
    return "https://images.unsplash.com/photo-1519681393784-d120267933ba";
  if (hour < 12)
    return "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8";
  if (hour < 18)
    return "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05";
  return "https://images.unsplash.com/photo-1472120435266-53107fd0c44a";
};

function App() {
  const [time, setTime] = useState<Date>(new Date());
  const [is24HourFormat, setIs24HourFormat] = useState<boolean>(true);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleTimeFormat = () => {
    setIs24HourFormat((prev) => !prev);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${getTimeBasedBackground()})` }}
    >
      <div className="min-h-screen bg-black/30 backdrop-blur-[2px]">
        <div className="container mx-auto py-8 px-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Search and Clock Section */}
            <div className="text-center space-y-6">
              <div>
                <h1
                  className="text-7xl font-bold text-white mb-3 tracking-tight cursor-pointer"
                  onClick={toggleTimeFormat}
                >
                  {is24HourFormat ? (
                    format(time, "HH:mm")
                  ) : (
                    <>
                      {format(time, "hh:mm")}
                      <span className="text-4xl font-light ml-2">
                        {format(time, "a")}
                      </span>
                    </>
                  )}
                </h1>
                <p className="text-2xl text-white/90 font-light">
                  {format(time, "EEEE, MMMM do, yyyy")}
                </p>
              </div>
              <div className="max-w-2xl mx-auto">
                <Search />
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="rounded-lg p-4">
                  <Weather />
                </div>
                <div className="rounded-lg p-4">
                  <TodoList />
                </div>
              </div>

              {/* Middle Column */}
              <div className="lg:col-span-2 rounded-lg p-4">
                <TopSites />
              </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 rounded-lg p-4 h-96 overflow-auto">
                <News />
              </div>
              <div className="rounded-lg p-4 h-96 overflow-auto">
                <Quote />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

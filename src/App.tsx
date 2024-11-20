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

  if (hour < 6) {
    // Night
    return "https://images.unsplash.com/photo-1503264116251-35a269ce1283"; // Starry night
  } else if (hour < 9) {
    // Dawn
    return "https://images.unsplash.com/photo-1533804283514-16183d6b7643"; // Sunrise over hills
  } else if (hour < 12) {
    // Morning
    return "https://images.unsplash.com/photo-1531028658754-97dcf1b50a1b"; // Blue sky and clouds
  } else if (hour < 15) {
    // Early afternoon
    return "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8"; // Green fields
  } else if (hour < 18) {
    // Late afternoon
    return "https://images.unsplash.com/photo-1484027834018-7e12a4b040da"; // Golden hour
  } else if (hour < 21) {
    // Evening
    return "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0"; // City lights at dusk
  } else {
    // Night
    return "https://images.unsplash.com/photo-1494783367193-149034c05e8f"; // Quiet nighttime scene
  }
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
        <div className="container mx-auto py-8 px-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Search and Clock Section */}
            <div className="text-center space-y-6">
              <div>
                <h1 className="text-7xl font-bold text-white mb-3 tracking-tight">
                  {format(time, "HH:mm")}
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
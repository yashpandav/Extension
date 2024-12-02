import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { Search } from "./components/Search";
import { Weather } from "./components/Weather";
import TodoList from "./components/TodoList";
import { News } from "./components/News";
import { Quote } from "./components/Quote";
import { TopSites } from "./components/TopSites";
import { CustomizeModel } from "./components/CustomizeModel";
import { PenLine } from "lucide-react";


const getTimeBasedBackground = (): string => {
  const hour = new Date().getHours();

  if (hour < 6)
    return "https://images.unsplash.com/photo-1519681393784-d120267933ba"; // Night
  if (hour < 9)
    return "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0"; // Early Morning
  if (hour < 12)
    return "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8"; // Morning
  if (hour < 15)
    return "https://images.unsplash.com/photo-1518837695005-2083093ee35b"; // Noon
  if (hour < 18)
    return "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05"; // Afternoon
  if (hour < 20)
    return "https://images.unsplash.com/photo-1517694712202-14dd9538aa97"; // Evening
  return "https://images.unsplash.com/photo-1472120435266-53107fd0c44a"; // Night
};

function App() {
  const [time, setTime] = useState(new Date());
  const [is24HourFormat, setIs24HourFormat] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [background, setBackground] = useState(getTimeBasedBackground());
  const [color, setColor] = useState("bg-black/30");

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleTimeFormat = () => setIs24HourFormat((prev) => !prev);

  const buttonRef = useRef<HTMLButtonElement>(null);

  // Improved function to ensure button remains at the bottom right of the visible area
  useEffect(() => {
    const updateButtonPosition = () => {
      if (buttonRef.current) {
        // Get current scroll position
        const scrollY = window.scrollY;
        
        // Get the height of the window
        const windowHeight = window.innerHeight;
        
        // Get the height of the entire document
        const documentHeight = document.documentElement.scrollHeight;
        
        // Get the height of the button
        const buttonHeight = buttonRef.current.offsetHeight;
        
        // Calculate the bottom position
        const bottomPosition = Math.max(
          20, // Minimum distance from bottom
          windowHeight - buttonHeight - 20 // Position at bottom of viewport with padding
        );

        // Apply positioning styles
        buttonRef.current.style.position = 'fixed';
        buttonRef.current.style.right = '24px'; // Consistent right margin
        buttonRef.current.style.bottom = `${bottomPosition}px`;
        
        // Adjust z-index to ensure visibility
        buttonRef.current.style.zIndex = '50';
      }
    };

    // Attach the event listener for scroll and resize
    window.addEventListener("scroll", updateButtonPosition);
    window.addEventListener("resize", updateButtonPosition);

    // Initial button position update
    updateButtonPosition();

    // Clean up the event listeners on component unmount
    return () => {
      window.removeEventListener("scroll", updateButtonPosition);
      window.removeEventListener("resize", updateButtonPosition);
    };
  }, []);



  return (
    <div
      className={`min-h-screen bg-cover bg-center bg-fixed ${color}`}
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="min-h-screen backdrop-blur-[2px]">
        <div className="container mx-auto py-8 px-6 max-w-7xl">
          {/* Search and Clock Section */}
          <div className="text-center space-y-6">
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
            <p className="text-2xl text-white/90 font-medium">
              {format(time, "EEEE, MMMM do, yyyy")}
            </p>
            <Search />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <div className="space-y-6">
              <Weather />
              <TodoList />
            </div>
            <div className="lg:col-span-2">
              <TopSites />
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2 h-96 overflow-auto">
              <News />
            </div>
            <div className="h-96 overflow-auto">
              <Quote />
            </div>
          </div>

          {/* Customize Button */}
          <button
            ref={buttonRef}
            className="fixed right-6 bg-white p-4 rounded-full shadow-lg text-black"
            onClick={() => setIsModalOpen(true)}
          >
            <PenLine />
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <CustomizeModel
          setBackground={setBackground}
          setColor={setColor}
          setIsModalOpen={setIsModalOpen}
          color={color}
          background={background}
        />
      )}
    </div>
  );
}

export default App;

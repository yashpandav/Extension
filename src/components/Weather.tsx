import React from 'react';
import { Cloud, Sun, CloudRain } from 'lucide-react';
import { useEffect , useState } from 'react';

export const Weather = () => {
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    // Mock weather data (replace with actual API call)
    setWeather({
      temp: 72,
      condition: 'Partly Cloudy',
      location: 'New York, NY'
    });
  }, []);

  if (!weather) return null;

  return (
    <div className="bg-white/30 backdrop-blur-md rounded-xl p-4 shadow-lg">
      <div className="flex items-center gap-3">
        <Cloud className="w-8 h-8 text-gray-700" />
        <div>
          <h2 className="text-2xl font-bold">{weather.temp}°F</h2>
          <p className="text-sm text-gray-700">{weather.location}</p>
        </div>
      </div>
    </div>
  );
};
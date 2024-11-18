import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, AlertCircle  } from 'lucide-react';

export const Weather = () => {
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  
  const fetchWeather = (latitude: number, longitude: number) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`;

    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch weather data.');
        return response.json();
      })
      .then((data) => {
        const formattedWeather = {
          temp: Math.round(data.main.temp),
          condition: data.weather[0].description,
          location: `${data.name}, ${data.sys.country}`,
        };
        setWeather(formattedWeather);
      })
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather(latitude, longitude);
      },
      () => setError('Unable to retrieve your location.')
    );
  }, []);

  // if (error) {
  //   return (
  //     <div className="relative backdrop-blur-lg bg-red-500/10 border border-red-100 text-red-700 p-6 rounded-3xl shadow-lg">
  //       <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent rounded-3xl"></div>
  //       <p className="relative font-medium flex items-center gap-2">
  //         <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
  //         Error: {error}
  //       </p>
  //     </div>
  //   );
  // }

  
  if (error) {
    return (
      <div className="relative overflow-hidden">
        <div className="absolute -top-3 -right-3 w-16 h-16 bg-red-400/20 rounded-full blur-lg"></div>
        <div className="absolute -bottom-3 -left-3 w-16 h-16 bg-red-300/20 rounded-full blur-lg"></div>
        
        <div className="relative backdrop-blur-xl bg-white/90 border border-red-200 
                      rounded-2xl p-4 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-transparent rounded-2xl"></div>
          
          <div className="relative space-y-2">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span className="font-semibold">Weather Data Unavailable</span>
            </div>
            
            <p className="text-sm text-gray-700 pl-7">
              {error}
            </p>
            
            <p className="text-xs text-gray-500 pl-7">
              Please check your connection and try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="relative backdrop-blur-lg bg-white/30 rounded-3xl p-6 shadow-lg border border-white/50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-transparent rounded-3xl"></div>
        <div className="relative flex items-center gap-3">
          <div className="animate-pulse w-12 h-12 bg-white/50 rounded-full"></div>
          <div className="space-y-3">
            <div className="animate-pulse w-24 h-6 bg-white/50 rounded-full"></div>
            <div className="animate-pulse w-32 h-4 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  const handleWeatherClick = () => {
    const query = encodeURIComponent('current weather');
    window.open(`https://www.google.com/search?q=${query}`);
  };

  const getWeatherIcon = () => {
    const condition = weather.condition.toLowerCase();
    const baseClasses = "w-12 h-12";
    
    if (condition.includes('rain')) {
      return <CloudRain className={`${baseClasses} text-blue-500`} />;
    } else if (condition.includes('cloud')) {
      return <Cloud className={`${baseClasses} text-gray-500`} />;
    }
    return <Sun className={`${baseClasses} text-yellow-400`} />;
  };

  return (
    <div
      className="group relative cursor-pointer"
      onClick={handleWeatherClick}
    >
      {/* Decorative circles in background */}
      <div className="absolute -top-3 -right-3 w-16 h-16 bg-blue-400/30 rounded-full blur-lg"></div>
      <div className="absolute -bottom-3 -left-3 w-16 h-16 bg-purple-400/20 rounded-full blur-lg"></div>
      
      {/* Main card */}
      <div className="relative backdrop-blur-xl bg-white/20 rounded-2xl p-6 shadow-md 
                    border border-white/30 overflow-hidden
                    hover:shadow-lg hover:bg-white/30 transition-all duration-300">
        {/* Inner gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-transparent"></div>
        
        {/* Content */}
        <div className="relative flex items-start gap-4">
          <div className="p-1">
            {getWeatherIcon()}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-baseline gap-1">
              <h2 className="text-2xl font-bold text-gray-800">
                {weather.temp}°
              </h2>
              <span className="text-sm text-gray-600">C</span>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700">
                {weather.location}
              </p>
              <p className="text-xs text-gray-600 capitalize">
                {weather.condition}
              </p>
            </div>
          </div>
        </div>

        {/* Hover effect */}
        <div className="absolute bottom-2 right-3 text-[10px] text-gray-500 opacity-0 
                      group-hover:opacity-100 transition-opacity duration-300">
          View details →
        </div>
      </div>
    </div>
  );
};
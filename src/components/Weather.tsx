import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, AlertCircle, Clock } from 'lucide-react';

export const Weather = () => {
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const fetchWeather = (latitude: number, longitude: number) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      setError('Request timed out. Please try again.');
    }, 10000);

    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch weather data.');
        return response.json();
      })
      .then((data) => {
        clearTimeout(timeoutId);
        const formattedWeather = {
          temp: Math.round(data.main.temp),
          condition: data.weather[0].description,
          location: `${data.name}, ${data.sys.country}`,
        };
        setWeather(formattedWeather);
      })
      .catch((err) => {
        clearTimeout(timeoutId);
        if (err.name === 'AbortError') {
          setError('Request timed out after 10 seconds. Please try again.');
        } else {
          setError(err.message);
        }
      });

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
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
      () => setError('Please turn on location permission to retrieve your location.')
    );
  }, []);

  if (error) {
    return (
      <div className="relative overflow-hidden">
        <div className="absolute -top-3 -right-3 w-16 h-16 bg-red-400/20 rounded-full blur-lg"></div>
        <div className="absolute -bottom-3 -left-3 w-16 h-16 bg-red-300/20 rounded-full blur-lg"></div>

        <div className="relative backdrop-blur-xl bg-white/80 border border-red-200 
                      rounded-2xl p-4 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-transparent rounded-2xl"></div>

          <div className="relative space-y-2">
            <div className="flex items-center gap-2 text-red-700">
              {error.includes('timeout') ? (
                <Clock className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="font-semibold">Weather Data Unavailable</span>
            </div>

            <p className="text-sm text-gray-800 pl-7">
              {error}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="ml-7 mt-2 text-xs text-blue-700 hover:text-blue-800 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="relative backdrop-blur-xl bg-white/20 rounded-2xl p-6 shadow-md border border-white/30 overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-transparent"></div>
        <div className="relative animate-pulse flex items-center gap-3">
          <div className="w-12 h-12 bg-white/50 rounded-full"></div>
          <div className="space-y-3">
            <div className="w-24 h-6 bg-white/50 rounded-full"></div>
            <div className="w-32 h-4 bg-white/50 rounded-full"></div>
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
      return <CloudRain className={`${baseClasses} text-blue-600`} />;
    } else if (condition.includes('cloud')) {
      return <Cloud className={`${baseClasses} text-gray-600`} />;
    }
    return <Sun className={`${baseClasses} text-amber-400`} />;
  };
  return (
    <div
      className="group relative cursor-pointer"
      onClick={handleWeatherClick}
    >
      <div className="absolute -top-3 -right-3 w-12 h-14 bg-indigo-400/20 rounded-full blur-lg"></div>
      <div className="absolute -bottom-3 -left-3 w-12 h-14 bg-blue-400/20 rounded-full blur-lg"></div>

      <div className="relative backdrop-blur-xl bg-white/10 rounded-2xl p-6 shadow-md border border-white/30 overflow-hidden hover:shadow-lg hover:bg-white/15 transition-all duration-300">
        <div className="relative flex items-start gap-4">
          <div className="p-1">{getWeatherIcon()}</div>

          <div className="space-y-2">
            <div className="flex items-baseline gap-1">
              <h2 className="text-3xl font-bold text-gray-900 drop-shadow-md">{weather.temp}°</h2>
              <span className="text-xl font-semibold text-gray-800 drop-shadow-md">C</span>
            </div>

            <div className="space-y-1">
              <p className="text-base font-semibold text-gray-900 drop-shadow-md">{weather.location}</p>
              <p className="text-sm font-semibold text-slate-900 capitalize drop-shadow-md">{weather.condition}</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-2 right-3 text-[10px] text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          View details →
        </div>
      </div>
    </div>
  );
};

export default Weather;

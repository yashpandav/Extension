import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain } from 'lucide-react';

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
          temp: data.main.temp,
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

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-md shadow-md">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="bg-gray-50 rounded-xl p-4 shadow-md text-center">
        <p>Loading weather data...</p>
      </div>
    );
  }

  const handleWeatherClick = () => {
    const query = encodeURIComponent('current weather');
    window.open(`https://www.google.com/search?q=${query}`);
  };

  return (
    <div
      className="bg-gray-50 rounded-xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-all"
      onClick={handleWeatherClick}
    >
      <div className="flex items-center gap-4">
        {weather.condition.toLowerCase().includes('rain') ? (
          <CloudRain className="w-10 h-10 text-blue-500" />
        ) : weather.condition.toLowerCase().includes('cloud') ? (
          <Cloud className="w-10 h-10 text-gray-500" />
        ) : (
          <Sun className="w-10 h-10 text-yellow-400" />
        )}
        <div>
          <h2 className="text-3xl font-bold text-gray-800">{weather.temp}°C</h2>
          <p className="text-lg text-gray-600">{weather.location}</p>
          <p className="text-sm text-gray-500 capitalize">{weather.condition}</p>
        </div>
      </div>
    </div>
  );
};

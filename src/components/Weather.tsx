import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain } from 'lucide-react';

export const Weather = () => {
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const API_KEY = 'c0f0869da45c570a16e74206592c8b58';

  const fetchWeather = (latitude: number, longitude: number) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;

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
      <div className="bg-red-100 text-red-700 p-4 rounded-md">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="bg-white/30 backdrop-blur-md rounded-xl p-4 shadow-lg text-center">
        <p>Loading weather data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white/30 backdrop-blur-md rounded-xl p-4 shadow-lg">
      <div className="flex items-center gap-3">
        {weather.condition.toLowerCase().includes('rain') ? (
          <CloudRain className="w-8 h-8 text-blue-600" />
        ) : weather.condition.toLowerCase().includes('cloud') ? (
          <Cloud className="w-8 h-8 text-gray-600" />
        ) : (
          <Sun className="w-8 h-8 text-yellow-500" />
        )}
        <div>
          <h2 className="text-2xl font-bold">{weather.temp}°C</h2>
          <p className="text-sm text-gray-700">{weather.location}</p>
          <p className="text-sm text-gray-500 capitalize">{weather.condition}</p>
        </div>
      </div>
    </div>
  );
};

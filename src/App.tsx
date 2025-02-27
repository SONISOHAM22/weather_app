import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MapPin, Navigation, Wind, Droplets, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from 'react-query';
import type { WeatherResponse, WeatherData } from './types';
import { getWeatherBackground, getWeatherEmoji } from './weatherUtils';
import { WeatherBackground } from './weatherEffects';
import { searchCities, GeoCity } from './citySearch';

const API_KEY = '8d2de98e089f1c28e1a22fc19a24ef04';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [bgGradient, setBgGradient] = useState('from-blue-500 to-purple-600');

  const { data: suggestions = [], isLoading: suggestionsLoading } = useQuery(
    ['cities', city],
    () => searchCities(city),
    {
      enabled: city.length >= 2,
      staleTime: 60000,
      cacheTime: 300000,
    }
  );

  useEffect(() => {
    if (weather?.list[0]?.weather[0]?.icon) {
      setBgGradient(getWeatherBackground(weather.list[0].weather[0].icon));
    }
  }, [weather]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getWeather = async (searchCity: GeoCity) => {
    try {
      setLoading(true);
      setError('');
      
      const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${searchCity.lat}&lon=${searchCity.lon}&appid=${API_KEY}&units=metric`;
      const weatherResponse = await axios.get<WeatherResponse>(weatherUrl);
      
      setWeather(weatherResponse.data);
      setShowSuggestions(false);
    } catch (err) {
      setError('Error fetching weather data. Please try again.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            setLoading(true);
            setError('');
            const { latitude, longitude } = position.coords;
            const response = await axios.get<WeatherResponse>(
              `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
            );
            setWeather(response.data);
          } catch (err) {
            setError('Error fetching weather data for your location.');
            setWeather(null);
          } finally {
            setLoading(false);
          }
        },
        () => setError('Unable to get your location. Please allow location access or search for a city.')
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      getWeather(suggestions[0]);
    }
  };

  const handleSuggestionClick = (suggestion: GeoCity) => {
    setCity(suggestion.name);
    getWeather(suggestion);
  };

  const groupForecastByDay = (list: WeatherData[]) => {
    const grouped: { [key: string]: WeatherData[] } = {};
    list.forEach((item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(item);
    });
    return grouped;
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgGradient} p-4 transition-colors duration-1000 relative`}>
      {weather?.list[0]?.weather[0]?.icon && (
        <WeatherBackground weatherCode={weather.list[0].weather[0].icon} />
      )}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto relative z-10"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20">
          <motion.h1 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-4xl font-bold text-white text-center mb-8"
          >
            Weather Forecast {weather && getWeatherEmoji(weather.list[0].weather[0].icon)}
          </motion.h1>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <form onSubmit={handleSubmit} className="flex-1 relative">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" size={20} />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    setShowSuggestions(true);
                  }}
                  placeholder="Enter city name"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                />
              </div>
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    ref={suggestionsRef}
                    className="absolute w-full mt-1 bg-white/90 backdrop-blur-lg rounded-lg shadow-lg overflow-hidden z-10"
                  >
                    {suggestions.map((suggestion) => (
                      <motion.div
                        key={`${suggestion.name}-${suggestion.countryCode}-${suggestion.lat}-${suggestion.lon}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="px-4 py-2 hover:bg-white/80 cursor-pointer flex items-center gap-2 text-gray-800"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <MapPin size={16} className="text-gray-500" />
                        <span>{suggestion.name}, {suggestion.countryName}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={getCurrentLocation}
              className="px-6 py-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors flex items-center justify-center gap-2 text-white"
            >
              <Navigation size={20} />
              Current Location
            </motion.button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-200 text-center mb-4 bg-red-500/20 rounded-lg p-3"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {loading ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-white text-center flex items-center justify-center gap-2"
              >
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                Loading...
              </motion.div>
            ) : weather ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center mb-8">
                  <motion.h2 
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="text-3xl font-bold text-white mb-2"
                  >
                    {weather.city.name}, {weather.city.country}
                  </motion.h2>
                  <div className="flex justify-center items-center gap-6 text-white">
                    <motion.div 
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      className="text-6xl font-bold"
                    >
                      {Math.round(weather.list[0].main.temp)}°C
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, rotate: -180 }}
                      animate={{ opacity: 1, rotate: 0 }}
                    >
                      <img
                        src={`https://openweathermap.org/img/wn/${weather.list[0].weather[0].icon}@2x.png`}
                        alt={weather.list[0].weather[0].description}
                        className="w-20 h-20 drop-shadow-lg"
                      />
                      <p className="capitalize">{weather.list[0].weather[0].description}</p>
                    </motion.div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-6 mt-4 text-white">
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className="flex items-center gap-2 bg-white/10 p-3 rounded-lg"
                    >
                      <Wind size={20} />
                      <span>{weather.list[0].wind.speed} m/s</span>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className="flex items-center gap-2 bg-white/10 p-3 rounded-lg"
                    >
                      <Droplets size={20} />
                      <span>{weather.list[0].main.humidity}%</span>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className="flex items-center gap-2 bg-white/10 p-3 rounded-lg"
                    >
                      <ArrowDown size={20} />
                      <span>{weather.list[0].main.pressure} hPa</span>
                    </motion.div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {Object.entries(groupForecastByDay(weather.list)).slice(0, 5).map(([date, forecasts], index) => (
                    <motion.div
                      key={date}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-white border border-white/20"
                    >
                      <h3 className="font-semibold mb-2">
                        {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </h3>
                      <div className="flex flex-col items-center">
                        <motion.img
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.2 }}
                          src={`https://openweathermap.org/img/wn/${forecasts[0].weather[0].icon}@2x.png`}
                          alt={forecasts[0].weather[0].description}
                          className="w-16 h-16 drop-shadow-lg"
                        />
                        <div className="text-2xl font-bold">{Math.round(forecasts[0].main.temp)}°C</div>
                        <p className="text-sm capitalize">{forecasts[0].weather[0].description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-white bg-white/10 p-6 rounded-lg backdrop-blur-sm"
              >
                Enter a city name or use your current location to get the weather forecast
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default App;
// services/weatherService.ts
// Weather API service using OpenWeatherMap

import axios from 'axios';
import type { WeatherData, ForecastData, ChartDataPoint } from '../types';

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'demo';
const WEATHER_API_URL = import.meta.env.VITE_WEATHER_API_URL || 'https://api.openweathermap.org/data/2.5';

/**
 * Fetch current weather data for a city
 * @param city - City name (e.g., "London" or "London,UK")
 */
export const getCurrentWeather = async (city: string): Promise<WeatherData> => {
  try {
    const response = await axios.get<WeatherData>(`${WEATHER_API_URL}/weather`, {
      params: {
        q: city,
        appid: WEATHER_API_KEY,
        units: 'metric', // Use Celsius
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw new Error('Failed to fetch weather data');
  }
};

/**
 * Fetch 5-day weather forecast for a city
 * @param city - City name
 */
export const getWeatherForecast = async (city: string): Promise<ForecastData> => {
  try {
    const response = await axios.get<ForecastData>(`${WEATHER_API_URL}/forecast`, {
      params: {
        q: city,
        appid: WEATHER_API_KEY,
        units: 'metric',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    throw new Error('Failed to fetch forecast data');
  }
};

/**
 * Transform forecast data into chart-friendly format
 * @param forecastData - Raw forecast data from API
 */
export const transformForecastToChartData = (
  forecastData: ForecastData
): ChartDataPoint[] => {
  return forecastData.list.slice(0, 8).map((item) => ({
    time: new Date(item.dt * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    temperature: Math.round(item.main.temp),
    humidity: item.main.humidity,
    pressure: item.main.pressure,
  }));
};

/**
 * Get weather by geolocation coordinates
 * @param lat - Latitude
 * @param lon - Longitude
 */
export const getWeatherByCoordinates = async (
  lat: number,
  lon: number
): Promise<WeatherData> => {
  try {
    const response = await axios.get<WeatherData>(`${WEATHER_API_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: WEATHER_API_KEY,
        units: 'metric',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather by coordinates:', error);
    throw new Error('Failed to fetch weather data');
  }
};
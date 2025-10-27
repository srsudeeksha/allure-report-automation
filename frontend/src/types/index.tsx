// types/index.ts
// Central type definitions for the application

/**
 * User interface for authentication and friends list
 */
export interface User {
  id: number;
  username: string;
  email: string;
  createdAt?: string;
}

/**
 * Authentication response from backend
 */
export interface AuthResponse {
  token: string;
  user: User;
}

/**
 * Weather data structure from OpenWeatherMap API
 */
export interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  name: string;
}

/**
 * Forecast data for 5-day weather prediction
 */
export interface ForecastData {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      humidity: number;
      pressure: number;
    };
    weather: Array<{
      description: string;
      icon: string;
    }>;
    dt_txt: string;
  }>;
  city: {
    name: string;
    country: string;
  };
}

/**
 * Chart data point for weather visualizations
 */
export interface ChartDataPoint {
  time: string;
  temperature: number;
  humidity: number;
  pressure?: number;
}

/**
 * Chat message interface
 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

/**
 * API error response structure
 */
export interface ApiError {
  message: string;
  status?: number;
}
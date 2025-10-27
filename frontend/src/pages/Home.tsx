/* eslint-disable react-hooks/exhaustive-deps */
// pages/Home.tsx
// Main Weather Dashboard page with live weather data and charts

import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Navbar from '../components/layout/Navbar';
import WeatherChart from '../components/features/WeatherChart';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Search, MapPin, Thermometer, Droplets, Wind } from 'lucide-react';
import {
  getCurrentWeather,
  getWeatherForecast,
  transformForecastToChartData,
} from '../services/weatherService';
import type { WeatherData, ChartDataPoint } from '../types';

/**
 * Home page component - Weather Dashboard
 * Displays current weather and forecast charts
 */
const Home: React.FC = () => {
  const [city, setCity] = useState<string>('London');
  const [searchCity, setSearchCity] = useState<string>('London');
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch weather data for the specified city
   */
  const fetchWeatherData = async (cityName: string) => {
    setLoading(true);
    setError(null);

    try {
      // Fetch current weather and forecast in parallel
      const [current, forecast] = await Promise.all([
        getCurrentWeather(cityName),
        getWeatherForecast(cityName),
      ]);

      setCurrentWeather(current);
      setChartData(transformForecastToChartData(forecast));
      setCity(cityName);
    } catch (err) {
      setError('Failed to fetch weather data. Please check the city name and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle search form submission
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity.trim()) {
      fetchWeatherData(searchCity.trim());
    }
  };

  /**
   * Load default weather data on component mount
   */
  useEffect(() => {
    fetchWeatherData(city);
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="container mx-auto p-6 space-y-6">
            {/* Search Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <h1 className="text-3xl font-bold">Weather Dashboard</h1>
              <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
                <Input
                  type="text"
                  placeholder="Enter city name..."
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full md:w-64"
                />
                <Button type="submit" disabled={loading}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </form>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            )}

            {/* Current Weather Cards */}
            {!loading && currentWeather && (
              <>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">
                    {currentWeather.name}, {currentWeather.sys.country}
                  </span>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {/* Temperature Card */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Temperature
                      </CardTitle>
                      <Thermometer className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {Math.round(currentWeather.main.temp)}°C
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Feels like {Math.round(currentWeather.main.feels_like)}°C
                      </p>
                    </CardContent>
                  </Card>

                  {/* Humidity Card */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Humidity
                      </CardTitle>
                      <Droplets className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {currentWeather.main.humidity}%
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Atmospheric moisture
                      </p>
                    </CardContent>
                  </Card>

                  {/* Wind Speed Card */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Wind Speed
                      </CardTitle>
                      <Wind className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {currentWeather.wind.speed} m/s
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Current wind velocity
                      </p>
                    </CardContent>
                  </Card>

                  {/* Weather Condition Card */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Condition
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold capitalize">
                        {currentWeather.weather[0].description}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Current weather status
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Weather Charts */}
                <div className="grid gap-6 md:grid-cols-2">
                  <WeatherChart
                    data={chartData}
                    title="Temperature & Humidity Forecast"
                    type="line"
                  />
                  <WeatherChart
                    data={chartData}
                    title="Weather Comparison"
                    type="bar"
                  />
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
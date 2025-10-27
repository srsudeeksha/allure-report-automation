/* eslint-disable @typescript-eslint/no-explicit-any */
// __tests__/Home.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, afterEach } from 'vitest';
import Home from '../pages/Home';
import {
  getCurrentWeather,
  getWeatherForecast,
  transformForecastToChartData,
} from '../services/weatherService';
import type { WeatherData, ChartDataPoint } from '../types';

// --- MOCK SETUP ---

// Mock the weather service functions
vi.mock('../services/weatherService');

// Define mock data for a successful fetch (London)
const mockCurrentWeather: WeatherData = {
    name: 'London',
    sys: { country: 'GB' },
    main: { temp: 11.4, feels_like: 10.2, humidity: 75 },
    wind: { speed: 6.17 },
    weather: [{ description: 'few clouds' }],
    // Include other necessary properties from your WeatherData type
} as WeatherData;

const mockForecastData: any = [/* Simplified mock forecast data */];
const mockChartData: ChartDataPoint[] = [{ time: '05:30 PM', temperature: 12, humidity: 80 }];

// Setup default successful mocks for initial load
(getCurrentWeather as any).mockResolvedValue(mockCurrentWeather);
(getWeatherForecast as any).mockResolvedValue(mockForecastData);
(transformForecastToChartData as any).mockReturnValue(mockChartData);


// Mock the dependent components (Header, Navbar, WeatherChart)
vi.mock('../components/layout/Header', () => ({ default: () => <div data-testid="header" /> }));
vi.mock('../components/layout/Navbar', () => ({ default: () => <div data-testid="navbar" /> }));
vi.mock('../components/features/WeatherChart', () => ({ 
    default: (props: any) => <div data-testid="chart" data-title={props.title} /> 
}));

const renderComponent = () => render(<Home />);

// --- TEST SUITE ---

describe('Home Component (Weather Dashboard)', () => {
    afterEach(() => {
        vi.clearAllMocks();
        // Reset mocks to their default success state for isolation
        (getCurrentWeather as any).mockResolvedValue(mockCurrentWeather);
        (getWeatherForecast as any).mockResolvedValue(mockForecastData);
    });

    // --- 1. Rendering and Initial State Tests (H-R1 to H-R4) ---
    it('H-R1, H-R2, H-R3: renders initial UI, default city, and loading state', async() => {
        renderComponent();
        
        // Check core layout (H-R1)
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('navbar')).toBeInTheDocument();
        expect(screen.getByText('Weather Dashboard')).toBeInTheDocument();

        // Check search input default value (H-R2)
        const searchInput = screen.getByPlaceholderText(/Enter city name/i);
        expect(searchInput).toHaveValue('London');

        // Check initial loading state (H-R3) - using a generic role for the spinner
        // expect(await screen.findByText(/Loading/i)).toBeInTheDocument(); // If text is present
        // You might need a more specific selector if your spinner doesn't have visible text, e.g.:
        expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('H-R4: initially hides weather data, charts, and error alerts', () => {
        renderComponent();
        
        // No data elements before fetch completes
        expect(screen.queryByText('Temperature')).not.toBeInTheDocument();
        expect(screen.queryByText(/Failed to fetch/i)).not.toBeInTheDocument();
        expect(screen.queryByText('London, GB')).not.toBeInTheDocument();
        expect(screen.queryAllByTestId('chart')).toHaveLength(0);
    });

    // --- 2. Successful Data Fetch Tests (H-S1 to H-S4) ---
    it('H-S1, H-S2, H-S3: fetches data for default city and displays all dashboard components', async () => {
        renderComponent();
        
        // Wait for the asynchronous data fetching to finish
        await waitFor(() => {
            // H-S1: API calls were made for 'London'
            expect(getCurrentWeather).toHaveBeenCalledWith('London');
            expect(getWeatherForecast).toHaveBeenCalledWith('London');
        });

        // Verify Loading State is gone (H-S4 implicitly)
        expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();

        // H-S2: Verify data card contents are displayed
        expect(screen.getByText('London, GB')).toBeInTheDocument();
        expect(screen.getByText('11°C')).toBeInTheDocument(); // Rounded temp
        expect(screen.getByText('75%')).toBeInTheDocument();
        expect(screen.getByText('6.17 m/s')).toBeInTheDocument();
        expect(screen.getByText('few clouds')).toBeInTheDocument();

        // H-S3: Verify charts are rendered
        const charts = screen.getAllByTestId('chart');
        expect(charts).toHaveLength(2);
        expect(charts[0]).toHaveAttribute('data-title', 'Temperature & Humidity Forecast');
    });

    // --- 3. Search Functionality Tests (H-U1 to H-U3) ---
    it('H-U1: successfully searches for a new city and updates the dashboard', async () => {
        renderComponent();
        // Wait for initial load to complete
        await waitFor(() => expect(screen.getByText('London, GB')).toBeInTheDocument());

        // Setup mock for the new search
        (getCurrentWeather as any).mockResolvedValueOnce({
            ...mockCurrentWeather,
            name: 'Paris',
            sys: { country: 'FR' },
            main: { temp: 18, feels_like: 18, humidity: 60 },
        } as WeatherData);
        (getWeatherForecast as any).mockResolvedValueOnce([]);

        const searchInput = screen.getByPlaceholderText(/Enter city name/i);
        const searchButton = screen.getByRole('button', { name: /Search/i });

        // User action: type and click
        fireEvent.change(searchInput, { target: { value: 'Paris' } });
        fireEvent.click(searchButton);
        
        // Verify loading state appears (H-U2)
        expect(searchButton).toBeDisabled();
        
        // Wait for API call verification
        await waitFor(() => {
            expect(getCurrentWeather).toHaveBeenCalledWith('Paris');
        });
        
        // Verify UI update
        expect(searchButton).not.toBeDisabled();
        expect(screen.getByText('Paris, FR')).toBeInTheDocument();
        expect(screen.queryByText('London, GB')).not.toBeInTheDocument();
    });

    it('H-U3: prevents search submission if the input is empty', async () => {
        renderComponent();
        // Wait for initial load
        await waitFor(() => expect(screen.getByText('London, GB')).toBeInTheDocument());

        const searchInput = screen.getByPlaceholderText(/Enter city name/i);
        const searchButton = screen.getByRole('button', { name: /Search/i });
        
        // Clear the input
        fireEvent.change(searchInput, { target: { value: '  ' } }); 
        fireEvent.click(searchButton);

        // Verify NO new API calls were made (still only two from the initial load)
        expect(getCurrentWeather).toHaveBeenCalledTimes(1); 
        
        // Dashboard should remain showing the initial city
        expect(screen.getByText('London, GB')).toBeInTheDocument();
    });

    // --- 4. Error Handling Tests (H-F1 to H-F3) ---
    it('H-F1: displays error message if initial data fetch fails', async () => {
        // Setup mocks to reject
        (getCurrentWeather as any).mockRejectedValue(new Error('Network error'));
        (getWeatherForecast as any).mockRejectedValue(new Error('Network error'));

        renderComponent();
        
        // Wait for the failure to resolve
        await waitFor(() => {
            expect(screen.getByText('Failed to fetch weather data. Please check the city name and try again.')).toBeInTheDocument();
        });

        // Verify data cards are not visible
        expect(screen.queryByText('Temperature')).not.toBeInTheDocument();
        expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });
    
    it('H-F2, H-F3: retains old data on search failure and clears error on subsequent success', async () => {
        renderComponent();
        // Wait for initial load (London data is visible)
        await waitFor(() => expect(screen.getByText('London, GB')).toBeInTheDocument());

        // H-F2: Setup mock for search failure
        (getCurrentWeather as any).mockRejectedValueOnce(new Error('Invalid city'));
        const searchInput = screen.getByPlaceholderText(/Enter city name/i);
        
        // Search for 'BadCity' (fails)
        fireEvent.change(searchInput, { target: { value: 'BadCity' } });
        fireEvent.click(screen.getByRole('button', { name: /Search/i }));

        await waitFor(() => {
            // Verify error message is visible
            expect(screen.getByText('Failed to fetch weather data. Please check the city name and try again.')).toBeInTheDocument();
            // Verify old data is retained
            expect(screen.getByText('London, GB')).toBeInTheDocument();
        });

        // H-F3: Setup mock for subsequent success (Sydney)
        (getCurrentWeather as any).mockResolvedValueOnce({
            ...mockCurrentWeather, name: 'Sydney', sys: { country: 'AU' },
        } as WeatherData);

        // Search for 'Sydney' (succeeds)
        fireEvent.change(searchInput, { target: { value: 'Sydney' } });
        fireEvent.click(screen.getByRole('button', { name: /Search/i }));
        
        await waitFor(() => {
            // Verify new data is loaded
            expect(screen.getByText('Sydney, AU')).toBeInTheDocument();
            // Verify old error message is cleared
            expect(screen.queryByText('Failed to fetch weather data. Please check the city name and try again.')).not.toBeInTheDocument();
        });
    });
});

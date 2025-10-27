/* eslint-disable @typescript-eslint/no-explicit-any */
// components/features/WeatherChart.tsx
// Interactive weather charts using Recharts

import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { ChartDataPoint } from '../../types';

interface WeatherChartProps {
  data: ChartDataPoint[];
  title: string;
  type?: 'line' | 'bar';
}

/**
 * WeatherChart component for displaying temperature and humidity data
 * Uses Recharts library with responsive design
 */
const WeatherChart: React.FC<WeatherChartProps> = ({
  data,
  title,
  type = 'line',
}) => {
  /**
   * Custom tooltip for better data visualization
   */
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-3 shadow-md">
          <p className="font-semibold text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p
              key={index}
              className="text-xs"
              style={{ color: entry.color }}
            >
              {entry.name}: {entry.value}
              {entry.name === 'Temperature' ? '°C' : '%'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {type === 'line' ? (
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="time"
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '12px' }}
                iconType="circle"
              />
              <Line
                type="monotone"
                dataKey="temperature"
                name="Temperature"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))' }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="humidity"
                name="Humidity"
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--destructive))' }}
              />
            </LineChart>
          ) : (
            <BarChart
              data={data}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="time"
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '12px' }}
                iconType="circle"
              />
              <Bar
                dataKey="temperature"
                name="Temperature"
                fill="hsl(var(--primary))"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="humidity"
                name="Humidity"
                fill="hsl(var(--destructive))"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default WeatherChart;
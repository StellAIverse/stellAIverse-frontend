'use client';

import React, { useMemo, useCallback, useRef, useEffect } from 'react';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Area,
  AreaChart,
  ComposedChart,
  Bar,
} from 'recharts';
import { useDebounce } from 'use-debounce';
import PerformanceMonitor from '@/components/PerformanceMonitor';

export interface TradingDataPoint {
  timestamp: number;
  price: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  close: number;
}

export interface TradingChartProps {
  data: TradingDataPoint[];
  height?: number;
  width?: number;
  showVolume?: boolean;
  showCandlestick?: boolean;
  debounceMs?: number;
  maxDataPoints?: number;
  enablePerformanceMonitoring?: boolean;
  onPerformanceUpdate?: (metrics: { fps: number; renderTime: number; memoryUsage?: number }) => void;
}

interface ChartDataPoint {
  time: string;
  price: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  close: number;
}

// Memoized formatters to prevent unnecessary recalculations
const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(price);
};

const formatVolume = (volume: number): string => {
  if (volume >= 1000000) {
    return `${(volume / 1000000).toFixed(2)}M`;
  } else if (volume >= 1000) {
    return `${(volume / 1000).toFixed(2)}K`;
  }
  return volume.toFixed(0);
};

// Memoized color palette
const chartColors = {
  price: '#8b5cf6',
  volume: '#06b6d4',
  grid: 'rgba(139, 92, 246, 0.15)',
  text: '#cbd5e1',
  background: 'rgba(2, 6, 23, 0.9)',
  border: 'rgba(139, 92, 246, 0.35)',
  positive: '#22c55e',
  negative: '#ef4444',
};

// Optimized data transformation with memoization
const transformChartData = (data: TradingDataPoint[], maxPoints?: number): ChartDataPoint[] => {
  if (!data || data.length === 0) return [];

  let processedData = data;
  
  // Downsample data if too many points
  if (maxPoints && data.length > maxPoints) {
    const step = Math.ceil(data.length / maxPoints);
    processedData = data.filter((_, index) => index % step === 0);
  }

  return processedData.map(point => ({
    time: formatTimestamp(point.timestamp),
    price: point.price,
    volume: point.volume,
    high: point.high,
    low: point.low,
    open: point.open,
    close: point.close,
  }));
};

// Custom tooltip component with memoization
const CustomTooltip = React.memo(({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      style={{
        background: chartColors.background,
        border: `1px solid ${chartColors.border}`,
        borderRadius: '8px',
        padding: '12px',
        color: '#fff',
        fontSize: '12px',
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>{label}</div>
      {payload.map((entry: any, index: number) => (
        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
          <span style={{ color: entry.color }}>{entry.name}:</span>
          <span style={{ fontWeight: 'bold' }}>
            {entry.name.includes('Volume') ? formatVolume(entry.value) : formatPrice(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
});

CustomTooltip.displayName = 'CustomTooltip';

const OptimizedTradingChart: React.FC<TradingChartProps> = React.memo(({
  data,
  height = 400,
  width = '100%',
  showVolume = true,
  showCandlestick = false,
  debounceMs = 300,
  maxDataPoints = 1000,
  enablePerformanceMonitoring = false,
  onPerformanceUpdate,
}) => {
  const [debouncedData] = useDebounce(data, debounceMs);
  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef(performance.now());

  // Memoize chart data transformation
  const chartData = useMemo(() => {
    const startTime = performance.now();
    const result = transformChartData(debouncedData, maxDataPoints);
    const endTime = performance.now();
    
    // Track render performance
    renderCountRef.current++;
    if (renderCountRef.current % 10 === 0) {
      const avgRenderTime = (endTime - lastRenderTimeRef.current) / 10;
      lastRenderTimeRef.current = endTime;
      console.log(`Chart render #${renderCountRef.current}: ${(endTime - startTime).toFixed(2)}ms (avg: ${avgRenderTime.toFixed(2)}ms)`);
    }
    
    return result;
  }, [debouncedData, maxDataPoints, transformChartData]);

  // Early return for empty data
  if (!chartData || chartData.length === 0) {
    return (
      <div 
        style={{ 
          width, 
          height, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: chartColors.text,
          fontSize: '14px'
        }}
      >
        No trading data available
      </div>
    );
  }

  // Memoized chart components
  const ChartComponents = useMemo(() => {
    const components = [];

    // Price line
    components.push(
      <Line
        key="price"
        type="monotone"
        dataKey="price"
        stroke={chartColors.price}
        strokeWidth={2}
        dot={false}
        isAnimationActive={false}
        name="Price"
      />
    );

    // Volume bars (if enabled)
    if (showVolume) {
      components.push(
        <Bar
          key="volume"
          dataKey="volume"
          fill={chartColors.volume}
          opacity={0.3}
          isAnimationActive={false}
          name="Volume"
        />
      );
    }

    // Candlestick representation (if enabled)
    if (showCandlestick) {
      components.push(
        <Line
          key="high"
          type="monotone"
          dataKey="high"
          stroke={chartColors.positive}
          strokeWidth={1}
          dot={false}
          isAnimationActive={false}
          name="High"
        />,
        <Line
          key="low"
          type="monotone"
          dataKey="low"
          stroke={chartColors.negative}
          strokeWidth={1}
          dot={false}
          isAnimationActive={false}
          name="Low"
        />
      );
    }

    return components;
  }, [showVolume, showCandlestick]);

  return (
    <div style={{ position: 'relative' }}>
      {enablePerformanceMonitoring && (
        <PerformanceMonitor 
          onPerformanceUpdate={onPerformanceUpdate}
          targetFPS={60}
        />
      )}
      
      <div style={{ width, height }}>
        <ResponsiveContainer>
          {showCandlestick ? (
            <ComposedChart
              data={chartData}
              margin={{ left: 6, right: 6, top: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis 
                dataKey="time" 
                tick={{ fill: chartColors.text, fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                yAxisId="price"
                orientation="right"
                tick={{ fill: chartColors.text, fontSize: 11 }}
                domain={['dataMin - 0.1', 'dataMax + 0.1']}
              />
              {showVolume && (
                <YAxis 
                  yAxisId="volume"
                  orientation="left"
                  tick={{ fill: chartColors.text, fontSize: 11 }}
                  hide
                />
              )}
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {ChartComponents.map((component, index) => 
                React.cloneElement(component, {
                  yAxisId: component.props.dataKey === 'volume' ? 'volume' : 'price'
                })
              )}
            </ComposedChart>
          ) : (
            <LineChart
              data={chartData}
              margin={{ left: 6, right: 6, top: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis 
                dataKey="time" 
                tick={{ fill: chartColors.text, fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fill: chartColors.text, fontSize: 11 }}
                domain={['dataMin - 0.1', 'dataMax + 0.1']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {ChartComponents}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
});

OptimizedTradingChart.displayName = 'OptimizedTradingChart';

export default OptimizedTradingChart;

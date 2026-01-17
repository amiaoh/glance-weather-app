import { Box, Table } from '@chakra-ui/react';
import type { HourlyForecast, WeatherData } from '../../types/weather';
import { useCallback, useEffect, useRef, useState } from 'react';

import { WeatherIcon } from './WeatherIcon';
import { getWeatherInfo } from '../../utils/weatherCodeMapper';

interface WeatherTableProps {
  data: WeatherData;
}

function formatHour(date: Date): string {
  const hour = date.getHours();
  if (hour === 0) return '12am';
  if (hour === 12) return '12pm';
  if (hour < 12) return `${hour}am`;
  return `${hour - 12}pm`;
}

function formatDay(date: Date): string {
  return date.toLocaleDateString('en-AU', { weekday: 'short' });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'numeric' });
}

function getUVColor(uv: number | null): string {
  if (uv === null) return 'transparent';
  if (uv <= 2) return 'var(--uv-low)';
  if (uv <= 5) return 'var(--uv-moderate)';
  if (uv <= 7) return 'var(--uv-high)';
  if (uv <= 10) return 'var(--uv-very-high)';
  return 'var(--uv-extreme)';
}

function getUVTextColor(uv: number | null): string {
  if (uv === null) return 'var(--text-muted)';
  if (uv <= 7) return '#000';
  return '#fff';
}

function getCurrentHourIndex(data: WeatherData): number {
  const now = new Date();
  return data.hourly.findIndex(h =>
    h.time.getHours() === now.getHours() &&
    h.time.toDateString() === now.toDateString()
  );
}

const COLUMN_WIDTH = 44;

const stickyColumnStyles = {
  position: 'sticky' as const,
  left: 0,
  zIndex: 10,
  bg: 'var(--bg-secondary)',
  borderRight: '1px solid var(--border-color)',
  minWidth: '60px',
  paddingX: '8px',
  paddingY: '4px',
};

const cellStyles = {
  minWidth: `${COLUMN_WIDTH}px`,
  maxWidth: `${COLUMN_WIDTH}px`,
  textAlign: 'center' as const,
  paddingX: '2px',
  paddingY: '4px',
  fontSize: 'xs',
};

const WindIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
    <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
    <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
  </svg>
);

const RainIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  </svg>
);

export function WeatherTable({ data }: WeatherTableProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [visibleDate, setVisibleDate] = useState<Date>(data.hourly[0]?.time ?? new Date());
  const currentIndex = getCurrentHourIndex(data);

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const scrollLeft = scrollContainerRef.current.scrollLeft;
    const stickyColumnWidth = 60;
    const index = Math.floor((scrollLeft + stickyColumnWidth) / COLUMN_WIDTH);
    const clampedIndex = Math.min(Math.max(0, index), data.hourly.length - 1);

    if (data.hourly[clampedIndex]) {
      setVisibleDate(data.hourly[clampedIndex].time);
    }
  }, [data.hourly]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  useEffect(() => {
    if (scrollContainerRef.current && currentIndex >= 0) {
      const scrollPosition = Math.max(0, currentIndex * COLUMN_WIDTH);
      scrollContainerRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }
  }, [currentIndex]);

  const renderHourCell = (hour: HourlyForecast, index: number) => {
    const isCurrent = index === currentIndex;
    return (
      <Table.Cell
        key={hour.time.toISOString()}
        {...cellStyles}
        bg={isCurrent ? 'var(--bg-card)' : !hour.isDay ? 'rgba(0,0,0,0.1)' : 'transparent'}
        fontWeight={isCurrent ? 'bold' : 'normal'}
      >
        {formatHour(hour.time)}
      </Table.Cell>
    );
  };

  return (
    <Box
      ref={scrollContainerRef}
      overflowX="auto"
      overflowY="hidden"
      flex="1"
      css={{
        '&::-webkit-scrollbar': { height: '4px' },
        '&::-webkit-scrollbar-track': { background: 'var(--bg-secondary)' },
        '&::-webkit-scrollbar-thumb': { background: 'var(--text-muted)', borderRadius: '2px' },
      }}
    >
      <Table.Root size="sm" css={{ borderCollapse: 'separate', borderSpacing: 0 }}>
        <Table.Body>
          

          {/* Row 2: Time */}
          <Table.Row>
            <Table.Cell {...stickyColumnStyles} fontSize="xs" color="var(--text-secondary)">
              <Box display="flex" flexDirection="column" alignItems="flex-start">
                <Box fontSize="xs" fontWeight="bold" color="var(--accent)">
                  {formatDay(visibleDate)}
                </Box>
                <Box fontSize="xs" color="var(--text-secondary)">
                  {formatDate(visibleDate)}
                </Box>
              </Box>
            </Table.Cell>
            {data.hourly.map(renderHourCell)}
          </Table.Row>

          {/* Row 3: Temperature */}
          <Table.Row>
            <Table.Cell {...stickyColumnStyles} fontSize="xs" color="var(--text-secondary)">
              Temp
            </Table.Cell>
            {data.hourly.map((hour, index) => {
              const isCurrent = index === currentIndex;
              return (
                <Table.Cell
                  key={`temp-${hour.time.toISOString()}`}
                  {...cellStyles}
                  bg={isCurrent ? 'var(--bg-card)' : !hour.isDay ? 'rgba(0,0,0,0.1)' : 'transparent'}
                  fontWeight="semibold"
                  fontSize="sm"
                >
                  {hour.temperature}°
                </Table.Cell>
              );
            })}
          </Table.Row>

          {/* Row 4: Weather Icon */}
          <Table.Row>
            <Table.Cell {...stickyColumnStyles} fontSize="xs" color="var(--text-secondary)">

            </Table.Cell>
            {data.hourly.map((hour, index) => {
              const isCurrent = index === currentIndex;
              const weatherInfo = getWeatherInfo(hour.weatherCode, hour.isDay);
              return (
                <Table.Cell
                  key={`icon-${hour.time.toISOString()}`}
                  {...cellStyles}
                  bg={isCurrent ? 'var(--bg-card)' : !hour.isDay ? 'rgba(0,0,0,0.1)' : 'transparent'}
                  title={weatherInfo.description}
                >
                  <WeatherIcon code={hour.weatherCode} isDay={hour.isDay} size={24} />
                </Table.Cell>
              );
            })}
          </Table.Row>

          {/* Row 5: Wind */}
          <Table.Row>
            <Table.Cell {...stickyColumnStyles}>
              <Box display="flex" alignItems="center" gap="4px" color="var(--text-secondary)">
                <WindIcon />
                <Box fontSize="xs">km/h</Box>
              </Box>
            </Table.Cell>
            {data.hourly.map((hour, index) => {
              const isCurrent = index === currentIndex;
              return (
                <Table.Cell
                  key={`wind-${hour.time.toISOString()}`}
                  {...cellStyles}
                  bg={isCurrent ? 'var(--bg-card)' : !hour.isDay ? 'rgba(0,0,0,0.1)' : 'transparent'}
                  color="var(--text-secondary)"
                >
                  {hour.windSpeed}
                </Table.Cell>
              );
            })}
          </Table.Row>

          {/* Row 6: UV */}
          <Table.Row>
            <Table.Cell {...stickyColumnStyles} fontSize="xs" color="var(--text-secondary)">
              UV
            </Table.Cell>
            {data.hourly.map((hour, index) => {
              const isCurrent = index === currentIndex;
              return (
                <Table.Cell
                  key={`uv-${hour.time.toISOString()}`}
                  {...cellStyles}
                  bg={isCurrent ? 'var(--bg-card)' : !hour.isDay ? 'rgba(0,0,0,0.1)' : 'transparent'}
                >
                  <Box
                    display="inline-flex"
                    alignItems="center"
                    justifyContent="center"
                    minWidth="20px"
                    height="16px"
                    borderRadius="2px"
                    fontSize="10px"
                    fontWeight="bold"
                    bg={getUVColor(hour.uvIndex)}
                    color={getUVTextColor(hour.uvIndex)}
                  >
                    {hour.uvIndex !== null ? Math.round(hour.uvIndex) : '-'}
                  </Box>
                </Table.Cell>
              );
            })}
          </Table.Row>

          {/* Row 7: Rain % */}
          <Table.Row>
            <Table.Cell {...stickyColumnStyles}>
              <Box display="flex" alignItems="center" gap="4px" color="var(--text-secondary)">
                <RainIcon />
                <Box fontSize="xs">%</Box>
              </Box>
            </Table.Cell>
            {data.hourly.map((hour, index) => {
              const isCurrent = index === currentIndex;
              return (
                <Table.Cell
                  key={`rain-pct-${hour.time.toISOString()}`}
                  {...cellStyles}
                  bg={isCurrent ? 'var(--bg-card)' : !hour.isDay ? 'rgba(0,0,0,0.1)' : 'transparent'}
                  color="var(--rain-moderate)"
                  fontSize="10px"
                >
                  {hour.precipitationProbability}
                </Table.Cell>
              );
            })}
          </Table.Row>

          {/* Row 8: Rain mm */}
          <Table.Row>
            <Table.Cell {...stickyColumnStyles} fontSize="xs" color="var(--text-secondary)" paddingLeft="24px">
              mm
            </Table.Cell>
            {data.hourly.map((hour, index) => {
              const isCurrent = index === currentIndex;
              const showAmount = hour.precipitation > 0;
              return (
                <Table.Cell
                  key={`rain-mm-${hour.time.toISOString()}`}
                  {...cellStyles}
                  bg={isCurrent ? 'var(--bg-card)' : !hour.isDay ? 'rgba(0,0,0,0.1)' : 'transparent'}
                  color="var(--rain-moderate)"
                  fontSize="10px"
                >
                  {showAmount ? hour.precipitation.toFixed(1) : ''}
                </Table.Cell>
              );
            })}
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </Box>
  );
}

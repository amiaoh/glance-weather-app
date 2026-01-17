import { useEffect, useRef } from 'react';

import { HourColumn } from './HourColumn';
import type { WeatherData } from '../../types/weather';
import styles from './ForecastChart.module.css';

interface ForecastChartProps {
  data: WeatherData;
}

function getCurrentHourIndex(data: WeatherData): number {
  const now = new Date();
  return data.hourly.findIndex(h =>
    h.time.getHours() === now.getHours() &&
    h.time.toDateString() === now.toDateString()
  );
}

export function ForecastChart({ data }: ForecastChartProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentIndex = getCurrentHourIndex(data);

  useEffect(() => {
    if (scrollRef.current && currentIndex >= 0) {
      const columnWidth = 48;
      const scrollPosition = Math.max(0, currentIndex * columnWidth - columnWidth);
      scrollRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }
  }, [currentIndex]);

  return (
    <div className={styles.container} ref={scrollRef}>
      <div className={styles.chart}>
        {data.hourly.map((hour, index) => (
          <HourColumn
            key={hour.time.toISOString()}
            data={hour}
            isCurrent={index === currentIndex}
          />
        ))}
      </div>
    </div>
  );
}

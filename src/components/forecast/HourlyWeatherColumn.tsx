import type { HourlyForecast } from '../../types/weather';
import { Precipitation } from './Precipitation';
import { UVIndicator } from './UVIndicator';
import { WeatherIcon } from './WeatherIcon';
import { WindSpeed } from './WindSpeed';
import styles from './HourColumn.module.css';

interface HourColumnProps {
  data: HourlyForecast;
  isCurrent: boolean;
}

function formatHour(date: Date): string {
  const hour = date.getHours();
  if (hour === 0) return '12am';
  if (hour === 12) return '12pm';
  if (hour < 12) return `${hour}am`;
  return `${hour - 12}pm`;
}

function formatDay(date: Date): string { 
const day = date.toLocaleDateString('en-AU', { weekday: 'short', });
  return day
}

function formatDate(date: Date): string { 
const day = date.toLocaleDateString('en-AU', { day: 'numeric', month: 'numeric' });
  return day
}

export function HourlyWeatherColumn({ data, isCurrent }: HourColumnProps) {
  const dayLabel = formatDay(data.time);
  const dateLabel = formatDate(data.time);

  return (
    <div className={`${styles.column} ${isCurrent ? styles.current : ''} ${!data.isDay ? styles.night : ''}`}>
      <div className={styles.time}>
        {dayLabel && <span className={styles.day}>{dayLabel}</span>}
        {dateLabel && <span className={styles.day}>{dateLabel}</span>}
        <span className={styles.hour}>{formatHour(data.time)}</span>
      </div>
      <div className={styles.temp}>{data.temperature}°</div>
      <WeatherIcon code={data.weatherCode} isDay={data.isDay} size={28} />
      <WindSpeed value={data.windSpeed} />
      <UVIndicator value={data.uvIndex} />
     <Precipitation probability={data.precipitationProbability} amount={data.precipitation} />
    </div>
  );
}

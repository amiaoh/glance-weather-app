import { getWeatherInfo } from '../../utils/weatherCodeMapper';
import styles from './WeatherIcon.module.css';

interface WeatherIconProps {
  code: number;
  isDay: boolean;
  size?: number;
}

export function WeatherIcon({ code, isDay, size = 32 }: WeatherIconProps) {
  const { icon, description } = getWeatherInfo(code, isDay);

  return (
    <img
      className={styles.icon}
      src={`/weather-icons/${icon}.svg`}
      alt={description}
      title={description}
      width={size}
      height={size}
    />
  );
}

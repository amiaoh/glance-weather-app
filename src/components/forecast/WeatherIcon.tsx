import { Image } from '@chakra-ui/react';
import { getWeatherInfo } from '../../utils/weatherCodeMapper';

interface WeatherIconProps {
  code: number;
  isDay: boolean;
  size?: number;
}

export function WeatherIcon({ code, isDay, size = 32 }: WeatherIconProps) {
  const { icon, description } = getWeatherInfo(code, isDay);

  return (
    <Image
      display="block"
      objectFit="contain"
      src={`/weather-icons/${icon}.svg`}
      alt={description}
      title={description}
      width={`${size}px`}
      height={`${size}px`}
    />
  );
}

import type { HourlyForecast } from '../../../types/weather';
import { StyledRow, LabelCell, DataCell, IconWrapper } from '../styles';
import { WeatherIcon } from '../WeatherIcon';
import { getWeatherInfo } from '../../../utils/weatherCodeMapper';

interface WeatherIconRowProps {
  hourly: HourlyForecast[];
  currentIndex: number;
}

export function WeatherIconRow({ hourly, currentIndex }: WeatherIconRowProps) {
  return (
    <StyledRow>
      <LabelCell />
      {hourly.map((hour, index) => {
        const weatherInfo = getWeatherInfo(hour.weatherCode, hour.isDay);
        return (
          <DataCell
            key={`icon-${hour.time.toISOString()}`}
            $isCurrent={index === currentIndex}
            $isNight={!hour.isDay}
            title={weatherInfo.description}
          >
            <IconWrapper>
              <WeatherIcon code={hour.weatherCode} isDay={hour.isDay} size={24} />
            </IconWrapper>
          </DataCell>
        );
      })}
    </StyledRow>
  );
}

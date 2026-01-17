import type { HourlyForecast } from '../../../types/weather';
import { StyledRow, LabelCell, TempCell } from '../styles';

interface TempRowProps {
  hourly: HourlyForecast[];
  currentIndex: number;
}

export function TempRow({ hourly, currentIndex }: TempRowProps) {
  return (
    <StyledRow>
      <LabelCell>Temp</LabelCell>
      {hourly.map((hour, index) => (
        <TempCell
          key={`temp-${hour.time.toISOString()}`}
          $isCurrent={index === currentIndex}
          $isNight={!hour.isDay}
        >
          {hour.temperature}°
        </TempCell>
      ))}
    </StyledRow>
  );
}

import type { HourlyForecast } from '../../../types/weather';
import { StyledRow, LabelCell, DataCell } from '../styles';
import { formatHour } from '../formatters';

interface TimeRowProps {
  hourly: HourlyForecast[];
  currentIndex: number;
}

export function TimeRow({ hourly, currentIndex }: TimeRowProps) {
  return (
    <StyledRow>
      <LabelCell>Time</LabelCell>
      {hourly.map((hour, index) => (
        <DataCell
          key={`time-${hour.time.toISOString()}`}
          $isCurrent={index === currentIndex}
          $isNight={!hour.isDay}
        >
          {formatHour(hour.time)}
        </DataCell>
      ))}
    </StyledRow>
  );
}

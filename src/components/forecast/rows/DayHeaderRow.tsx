import type { HourlyForecast } from '../../../types/weather';
import {
  StyledRow,
  LabelCell,
  DataCell,
  DayDateLabel,
  DayText,
  DateText,
  DayMarker,
} from '../styles';
import { formatDay, formatDate, isDayChange } from '../formatters';

interface DayHeaderRowProps {
  hourly: HourlyForecast[];
  visibleDate: Date;
  currentIndex: number;
}

export function DayHeaderRow({ hourly, visibleDate, currentIndex }: DayHeaderRowProps) {
  return (
    <StyledRow>
      <LabelCell>
        <DayDateLabel>
          <DayText>{formatDay(visibleDate)}</DayText>
          <DateText>{formatDate(visibleDate)}</DateText>
        </DayDateLabel>
      </LabelCell>
      {hourly.map((hour, index) => {
        const showDayMarker = isDayChange(hour.time, hourly[index - 1]?.time);
        return (
          <DataCell
            key={`day-${hour.time.toISOString()}`}
            $isCurrent={index === currentIndex}
            $isNight={!hour.isDay}
            $showDayMarker={showDayMarker}
          >
            {showDayMarker && <DayMarker>{formatDay(hour.time)}</DayMarker>}
          </DataCell>
        );
      })}
    </StyledRow>
  );
}

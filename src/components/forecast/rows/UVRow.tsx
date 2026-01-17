import type { HourlyForecast } from '../../../types/weather';
import { StyledRow, LabelCell, DataCell } from '../styles';
import { UVBadge } from '../UVBadge';

interface UVRowProps {
  hourly: HourlyForecast[];
  currentIndex: number;
}

export function UVRow({ hourly, currentIndex }: UVRowProps) {
  return (
    <StyledRow>
      <LabelCell>UV</LabelCell>
      {hourly.map((hour, index) => (
        <DataCell
          key={`uv-${hour.time.toISOString()}`}
          $isCurrent={index === currentIndex}
          $isNight={!hour.isDay}
        >
          <UVBadge value={hour.uvIndex} />
        </DataCell>
      ))}
    </StyledRow>
  );
}

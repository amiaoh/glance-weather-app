import type { HourlyForecast } from '../../../types/weather';
import { StyledRow, LabelCell, WindCell, LabelContent } from '../styles';
import { WindIcon } from '../Icons';

interface WindRowProps {
  hourly: HourlyForecast[];
  currentIndex: number;
}

export function WindRow({ hourly, currentIndex }: WindRowProps) {
  return (
    <StyledRow>
      <LabelCell>
        <LabelContent>
          <WindIcon />
          <span>km/h</span>
        </LabelContent>
      </LabelCell>
      {hourly.map((hour, index) => (
        <WindCell
          key={`wind-${hour.time.toISOString()}`}
          $isCurrent={index === currentIndex}
          $isNight={!hour.isDay}
        >
          {hour.windSpeed}
        </WindCell>
      ))}
    </StyledRow>
  );
}

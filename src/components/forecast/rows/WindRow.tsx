import { FaWind } from 'react-icons/fa';
import type { HourlyForecast } from '../../../types/weather';
import { StyledRow, LabelCell, WindCell, LabelContent } from '../styles';

interface WindRowProps {
  hourly: HourlyForecast[];
  currentIndex: number;
}

export function WindRow({ hourly, currentIndex }: WindRowProps) {
  return (
    <StyledRow>
      <LabelCell>
        <LabelContent>
          <FaWind />
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

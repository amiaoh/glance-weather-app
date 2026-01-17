import styled from 'styled-components';
import type { HourlyForecast } from '../../../types/weather';
import { StyledRow, LabelCell, RainCell, LabelContent } from '../styles';
import { RainIcon } from '../Icons';

interface RainRowsProps {
  hourly: HourlyForecast[];
  currentIndex: number;
}

const IndentedLabel = styled(LabelCell)`
  padding-left: 24px;
`;

export function RainPercentRow({ hourly, currentIndex }: RainRowsProps) {
  return (
    <StyledRow>
      <LabelCell>
        <LabelContent>
          <RainIcon />
          <span>%</span>
        </LabelContent>
      </LabelCell>
      {hourly.map((hour, index) => (
        <RainCell
          key={`rain-pct-${hour.time.toISOString()}`}
          $isCurrent={index === currentIndex}
          $isNight={!hour.isDay}
        >
          {hour.precipitationProbability}
        </RainCell>
      ))}
    </StyledRow>
  );
}

export function RainAmountRow({ hourly, currentIndex }: RainRowsProps) {
  return (
    <StyledRow>
      <IndentedLabel>mm</IndentedLabel>
      {hourly.map((hour, index) => (
        <RainCell
          key={`rain-mm-${hour.time.toISOString()}`}
          $isCurrent={index === currentIndex}
          $isNight={!hour.isDay}
        >
          {hour.precipitation > 0 ? hour.precipitation.toFixed(1) : ''}
        </RainCell>
      ))}
    </StyledRow>
  );
}

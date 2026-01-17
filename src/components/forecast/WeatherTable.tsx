import { useEffect } from 'react';
import type { WeatherData } from '../../types/weather';
import { useScrollTracking } from '../../hooks/useScrollTracking';
import { ScrollContainer, StyledTable, COLUMN_WIDTH, LABEL_COLUMN_WIDTH } from './styles';
import {
  DayHeaderRow,
  TimeRow,
  TempRow,
  WeatherIconRow,
  WindRow,
  UVRow,
  RainPercentRow,
  RainAmountRow,
} from './rows';

interface WeatherTableProps {
  data: WeatherData;
}

function getCurrentHourIndex(data: WeatherData): number {
  const now = new Date();
  return data.hourly.findIndex(
    h =>
      h.time.getHours() === now.getHours() &&
      h.time.toDateString() === now.toDateString()
  );
}

export function WeatherTable({ data }: WeatherTableProps) {
  const currentIndex = getCurrentHourIndex(data);

  const { scrollRef, visibleIndex, scrollToIndex } = useScrollTracking<HTMLDivElement>({
    columnWidth: COLUMN_WIDTH,
    labelColumnWidth: LABEL_COLUMN_WIDTH,
    itemCount: data.hourly.length,
    initialIndex: 0,
  });

  const visibleDate = data.hourly[visibleIndex]?.time ?? new Date();

  useEffect(() => {
    if (currentIndex >= 0) {
      scrollToIndex(currentIndex);
    }
  }, [currentIndex, scrollToIndex]);

  return (
    <ScrollContainer ref={scrollRef}>
      <StyledTable>
        <tbody>
          <DayHeaderRow
            hourly={data.hourly}
            visibleDate={visibleDate}
            currentIndex={currentIndex}
          />
          <TimeRow hourly={data.hourly} currentIndex={currentIndex} />
          <TempRow hourly={data.hourly} currentIndex={currentIndex} />
          <WeatherIconRow hourly={data.hourly} currentIndex={currentIndex} />
          <WindRow hourly={data.hourly} currentIndex={currentIndex} />
          <UVRow hourly={data.hourly} currentIndex={currentIndex} />
          <RainPercentRow hourly={data.hourly} currentIndex={currentIndex} />
          <RainAmountRow hourly={data.hourly} currentIndex={currentIndex} />
        </tbody>
      </StyledTable>
    </ScrollContainer>
  );
}

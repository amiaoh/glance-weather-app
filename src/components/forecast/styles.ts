import styled from 'styled-components';

export const COLUMN_WIDTH = 44;
export const LABEL_COLUMN_WIDTH = 60;

export const ScrollContainer = styled.div`
  overflow-x: auto;
  overflow-y: hidden;
  flex: 1;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: var(--bg-secondary);
  }

  &::-webkit-scrollbar-thumb {
    background: var(--text-muted);
    border-radius: 2px;
  }
`;

export const StyledTable = styled.table`
  border-collapse: separate;
  border-spacing: 0;
  font-size: var(--font-size-xs);
`;

export const StyledRow = styled.tr``;

export const LabelCell = styled.td`
  position: sticky;
  left: 0;
  z-index: 10;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  min-width: ${LABEL_COLUMN_WIDTH}px;
  padding: 4px 8px;
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
`;

export const LabelContent = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const DayDateLabel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const DayText = styled.span`
  font-size: var(--font-size-xs);
  font-weight: bold;
  color: var(--accent);
`;

export const DateText = styled.span`
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
`;

interface DataCellProps {
  $isCurrent?: boolean;
  $isNight?: boolean;
  $showDayMarker?: boolean;
}

export const DataCell = styled.td<DataCellProps>`
  min-width: ${COLUMN_WIDTH}px;
  max-width: ${COLUMN_WIDTH}px;
  text-align: center;
  padding: 4px 2px;
  font-size: var(--font-size-xs);
  background: ${({ $isCurrent, $isNight }) =>
    $isCurrent ? 'var(--bg-current-card)' : $isNight ? 'rgba(0,0,0,0.1)' : 'transparent'};
  font-weight: ${({ $isCurrent }) => ($isCurrent ? 'bold' : 'normal')};
  border-bottom: ${({ $showDayMarker }) =>
    $showDayMarker ? '2px solid var(--accent)' : 'none'};
`;

export const TempCell = styled(DataCell)`
  font-weight: 600;
  font-size: var(--font-size-sm);
`;

export const WindCell = styled(DataCell)`
  color: var(--text-secondary);
`;

export const RainCell = styled(DataCell)`
  color: var(--rain-moderate);
  font-size: 10px;
`;

export const DayMarker = styled.span`
  font-size: 9px;
  color: var(--accent);
  font-weight: bold;
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

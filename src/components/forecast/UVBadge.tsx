import styled from 'styled-components';

interface UVBadgeProps {
  value: number | null;
}

function getUVColor(uv: number | null): string {
  if (uv === null) return 'transparent';
  if (uv <= 2) return 'var(--uv-low)';
  if (uv <= 5) return 'var(--uv-moderate)';
  if (uv <= 7) return 'var(--uv-high)';
  if (uv <= 10) return 'var(--uv-very-high)';
  return 'var(--uv-extreme)';
}

function getUVTextColor(uv: number | null): string {
  if (uv === null) return 'var(--text-muted)';
  if (uv <= 7) return '#000';
  return '#fff';
}

const Badge = styled.span<{ $bg: string; $color: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 16px;
  border-radius: 2px;
  font-size: 10px;
  font-weight: bold;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
`;

export function UVBadge({ value }: UVBadgeProps) {
  return (
    <Badge $bg={getUVColor(value)} $color={getUVTextColor(value)}>
      {value !== null ? Math.round(value) : '-'}
    </Badge>
  );
}

import styled from 'styled-components';

type BadgeSize = 'sm' | 'lg';

interface UVBadgeProps {
  value: number | null;
  size?: BadgeSize;
  className?: string;
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

const sizeStyles = {
  sm: { minWidth: '20px', height: '16px', fontSize: '10px', borderRadius: '2px' },
  lg: { minWidth: '50px', height: '50px', fontSize: '24px', borderRadius: '6px' },
};

const Badge = styled.span<{ $bg: string; $color: string; $size: BadgeSize }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: ${({ $size }) => sizeStyles[$size].minWidth};
  height: ${({ $size }) => sizeStyles[$size].height};
  border-radius: ${({ $size }) => sizeStyles[$size].borderRadius};
  font-size: ${({ $size }) => sizeStyles[$size].fontSize};
  font-weight: bold;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
`;

export function UVBadge({ value, size = 'sm', className }: UVBadgeProps) {
  return (
    <Badge
      $bg={getUVColor(value)}
      $color={getUVTextColor(value)}
      $size={size}
      className={className}
    >
      {value !== null ? Math.round(value) : '-'}
    </Badge>
  );
}

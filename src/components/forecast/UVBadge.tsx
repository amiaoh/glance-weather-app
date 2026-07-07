import { Box } from '@chakra-ui/react';

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
  if (uv === null) return 'var(--ink3)';
  if (uv <= 7) return '#000';
  return '#fff';
}

const sizeStyles = {
  sm: { minW: '20px', h: '16px', fontSize: '10px', borderRadius: '2px' },
  lg: { minW: '50px', h: '50px', fontSize: '24px', borderRadius: '6px' },
};

export function UVBadge({ value, size = 'sm', className }: UVBadgeProps) {
  return (
    <Box
      className={className}
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      fontWeight="bold"
      bg={getUVColor(value)}
      color={getUVTextColor(value)}
      {...sizeStyles[size]}
    >
      {value !== null ? Math.round(value) : '-'}
    </Box>
  );
}

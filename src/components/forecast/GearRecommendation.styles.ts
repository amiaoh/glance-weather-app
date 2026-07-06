import type { SystemStyleObject } from '@chakra-ui/react';
import type { GearLevel } from '../../types/weather';

export const containerStyle: SystemStyleObject = {
  borderRadius: 'var(--radius-md)',
  borderLeft: '4px solid',
  background: 'bg.now',
  paddingInline: 'var(--padding-md)',
  paddingBlock: 'var(--padding-sm)',
  marginBottom: 'var(--padding-sm)',
};

export const rowStyle: SystemStyleObject = {
  alignItems: 'center',
  gap: 'var(--padding-sm)',
};

export const iconStyle: SystemStyleObject = {
  fontSize: '36px',
  flexShrink: 0,
};

export const labelStyle: SystemStyleObject = {
  fontSize: 'var(--font-size-base)',
  fontWeight: 700,
  color: 'text.primary',
};

export const detailStyle: SystemStyleObject = {
  fontSize: 'var(--font-size-xs)',
  color: 'text.muted',
};

export const LEVEL_COLOR: Record<GearLevel, string> = {
  none: 'uv.low',
  sun: 'uv.high',
  umbrella: 'rain.light',
  'wet-weather-gear': 'accent',
  windbreaker: 'rain.moderate',
};

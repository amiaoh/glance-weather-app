import type { SystemStyleObject } from '@chakra-ui/react';

export const containerStyle: SystemStyleObject = {
  padding: 'var(--padding-sm)',
  marginTop: 'var(--padding-sm)',
};

export const headerRowStyle: SystemStyleObject = {
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 'var(--padding-sm)',
};

export const headerTextStyle: SystemStyleObject = {
  fontSize: 'var(--font-size-sm)',
  fontWeight: 600,
  color: 'text.secondary',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

export const alertsGridStyle: SystemStyleObject = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
};

export const alertRowStyle: SystemStyleObject = {
  alignItems: 'center',
  gap: 'var(--padding-sm)',
  paddingBlock: 'var(--padding-sm)',
  borderBottom: '1px solid',
  borderColor: 'border.DEFAULT',
  _last: {
    borderBottom: 'none',
  },
};

export const alertContentStyle: SystemStyleObject = {
  alignItems: 'center',
  gap: 'var(--padding-sm)',
  flex: 1,
};

export const alertValueStyle: SystemStyleObject = {
  fontSize: 'var(--font-size-sm)',
  fontWeight: 600,
  color: 'text.primary',
  minWidth: '50px',
};

export const alertTimeStyle: SystemStyleObject = {
  fontSize: 'var(--font-size-xs)',
  color: 'text.muted',
};

export const alertIconStyle: SystemStyleObject = {
  fontSize: '50px',
  color: 'text.secondary',
  flexShrink: 0,
  textAlign: 'center',
};

// Severity colors for the rain/wind icons - mirrors the UV token scale used
// elsewhere so "moderate" always means the same color across the app.
export const rainIconColor = (level: 'light' | 'moderate' | 'heavy'): string => {
  if (level === 'heavy') return 'uv.veryHigh';
  if (level === 'moderate') return 'uv.moderate';
  return 'rain.light';
};

export const windIconColor = (level: 'moderate' | 'strong'): string => {
  if (level === 'strong') return 'uv.veryHigh';
  return 'uv.moderate';
};

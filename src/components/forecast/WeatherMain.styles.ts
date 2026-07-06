import type { SystemStyleObject } from '@chakra-ui/react';

// Chakra's breakpoint props only cover min-width, so the orientation/
// max-width edge cases from the old CSS module are expressed here as raw
// at-rules inside each style object.

export const tempValueStyle: SystemStyleObject = {
  fontSize: '36px',
  fontWeight: 600,
  color: 'text.primary',
  '@media (orientation: landscape)': { fontSize: '20px' },
  '@media (max-width: 320px)': { fontSize: '18px' },
};

export const uvIconStyle: SystemStyleObject = {
  fontSize: '20px',
  color: 'uv.high',
  '@media (orientation: landscape)': { fontSize: '18px' },
  '@media (max-width: 320px)': { fontSize: '16px' },
};

export const cardLabelStyle: SystemStyleObject = {
  fontSize: 'var(--font-size-sm)',
  color: 'text.muted',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: '4px',
  '@media (max-width: 320px)': { fontSize: '8px' },
};

export const peakTimeStyle: SystemStyleObject = {
  fontSize: 'var(--font-size-xs)',
  color: 'text.muted',
  '@media (max-width: 320px)': { fontSize: '8px' },
};

import type { SystemStyleObject } from '@chakra-ui/react';

export const containerStyle: SystemStyleObject = {
  padding: 'var(--padding-sm)',
  marginTop: 'var(--padding-sm)',
};

export const labelStyle: SystemStyleObject = {
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '1.6px',
  textTransform: 'uppercase',
  color: 'ink3',
  marginBottom: '12px',
};

export const listStyle: SystemStyleObject = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

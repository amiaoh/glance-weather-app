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

export const alertContentColumnStyle: SystemStyleObject = {
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '2px',
  flex: 1,
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

export const rainIconStyle: SystemStyleObject = {
  width: '40px',
  height: '40px',
  flexShrink: 0,
};

export const alertTextStyle: SystemStyleObject = {
  fontSize: 'var(--font-size-sm)',
  color: 'text.primary',
};

export const statsTextStyle: SystemStyleObject = {
  fontSize: 'var(--font-size-xs)',
  color: 'text.muted',
};

export const detailsToggleStyle: SystemStyleObject = {
  fontSize: 'var(--font-size-xs)',
  color: 'text.muted',
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  padding: 0,
  textDecoration: 'underline',
};

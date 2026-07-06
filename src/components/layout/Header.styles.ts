import type { SystemStyleObject } from '@chakra-ui/react';

export const headerStyle: SystemStyleObject = {
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 'var(--header-height)',
  px: 'var(--padding-sm)',
  background: 'bg.secondary',
  borderBottom: '1px solid',
  borderColor: 'border.DEFAULT',
};

export const sideGroupStyle: SystemStyleObject = {
  alignItems: 'center',
  gap: 'var(--padding-xs)',
};

export const citySelectFieldStyle: SystemStyleObject = {
  fontSize: 'var(--font-size-sm)',
  color: 'text.primary',
  fontWeight: 600,
  border: 'none',
  background: 'none',
  paddingInline: '4px 24px',
  paddingBlock: '2px',
};

export const updatedStyle: SystemStyleObject = {
  fontSize: 'var(--font-size-xs)',
  color: 'text.muted',
};

export const iconButtonStyle: SystemStyleObject = {
  color: 'text.muted',
  transition: 'color 0.2s',
  _hover: {
    color: 'text.primary',
  },
  _disabled: {
    cursor: 'not-allowed',
    opacity: 0.5,
  },
};

export const spinningStyle: SystemStyleObject = {
  animation: 'spin 0.8s linear infinite',
};

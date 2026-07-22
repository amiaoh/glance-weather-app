import type { SystemStyleObject } from '@chakra-ui/react';

export const headerStyle: SystemStyleObject = {
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 'var(--header-height)',
  px: 'var(--padding-sm)',
  background: 'card',
  borderBottom: '1px solid',
  borderColor: 'line',
  // AppShell only rounds its corners (46px) at this same breakpoint - pull
  // the side groups in further so they clear the curve instead of nearly
  // touching it.
  '@media (min-width: 480px)': {
    px: '20px',
  },
};

export const sideGroupStyle: SystemStyleObject = {
  alignItems: 'center',
  gap: 'var(--padding-xs)',
};

export const citySelectFieldStyle: SystemStyleObject = {
  fontSize: 'var(--font-size-sm)',
  color: 'ink',
  fontWeight: 600,
  border: 'none',
  background: 'none',
  paddingInline: '4px 24px',
  paddingBlock: '2px',
};

export const updatedStyle: SystemStyleObject = {
  fontSize: 'var(--font-size-xs)',
  color: 'ink3',
};

export const iconButtonStyle: SystemStyleObject = {
  color: 'ink3',
  transition: 'color 0.2s',
  _hover: {
    color: 'ink',
  },
  _disabled: {
    cursor: 'not-allowed',
    opacity: 0.5,
  },
};

export const spinningStyle: SystemStyleObject = {
  animation: 'spin 0.8s linear infinite',
};

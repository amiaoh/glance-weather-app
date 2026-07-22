import type { SystemStyleObject } from '@chakra-ui/react';

export const toggleStyle: SystemStyleObject = {
  position: 'absolute',
  bottom: '12px',
  left: '50%',
  transform: 'translateX(-50%)',
  width: 'min(220px, calc(100% - 64px))',
  zIndex: 9999,
  background: 'card',
  borderRadius: 'var(--radius-sm)',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
};

export const toggleFieldStyle: SystemStyleObject = {
  width: '100%',
  fontSize: 'var(--font-size-xs)',
  color: 'ink2',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

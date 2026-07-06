import type { SystemStyleObject } from '@chakra-ui/react';

export const toggleStyle: SystemStyleObject = {
  position: 'absolute',
  bottom: '8px',
  right: '8px',
  left: '8px',
  zIndex: 9999,
  background: 'bg.secondary',
  borderRadius: 'var(--radius-sm)',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
};

export const toggleFieldStyle: SystemStyleObject = {
  width: '100%',
  fontSize: 'var(--font-size-xs)',
  color: 'text.secondary',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

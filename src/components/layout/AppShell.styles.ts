import type { SystemStyleObject } from '@chakra-ui/react';

export const shellStyle: SystemStyleObject = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  maxHeight: '100vh',
  overflow: 'hidden',
  background: 'page',
  '@media (min-width: 480px)': {
    borderRadius: 'var(--radius-md)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.25)',
  },
};

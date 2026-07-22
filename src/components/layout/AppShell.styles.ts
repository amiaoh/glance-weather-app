import type { SystemStyleObject } from '@chakra-ui/react';

export const shellStyle: SystemStyleObject = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  maxHeight: '100vh',
  overflow: 'hidden',
  background: 'card',
  '@media (min-width: 480px)': {
    borderRadius: '46px',
    border: '1px solid',
    borderColor: 'line',
  },
};

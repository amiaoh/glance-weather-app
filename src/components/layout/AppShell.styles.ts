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
    boxShadow: '0 34px 64px -22px rgba(70, 52, 32, 0.34), 0 10px 24px -10px rgba(70, 52, 32, 0.2)',
    _dark: {
      boxShadow: '0 30px 60px -26px rgba(0, 0, 0, 0.7), 0 8px 20px -10px rgba(0, 0, 0, 0.5)',
    },
  },
};

import type { SystemStyleObject } from '@chakra-ui/react';

export const spinnerStyle: SystemStyleObject = {
  width: '32px',
  height: '32px',
  border: '3px solid',
  borderColor: 'border.DEFAULT',
  borderTopColor: 'accent',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
};

import type { SystemStyleObject } from '@chakra-ui/react';

export const spinnerStyle: SystemStyleObject = {
  width: '32px',
  height: '32px',
  border: '3px solid',
  borderColor: 'line',
  borderTopColor: 'accent',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
};

// Sits below the fixed-height Header inside AppShell's column flex layout.
// minHeight: 0 overrides the flex item default of auto, which otherwise
// refuses to shrink below content size and blocks the overflow scroll.
export const scrollContentStyle: SystemStyleObject = {
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
};

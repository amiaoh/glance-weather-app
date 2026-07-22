import type { SystemStyleObject } from '@chakra-ui/react';

export const overlayStyle: SystemStyleObject = {
  position: 'absolute',
  inset: 0,
  zIndex: 10,
};

export const scrimStyle: SystemStyleObject = {
  position: 'absolute',
  inset: 0,
  background: 'rgba(20, 14, 8, 0.4)',
  animation: 'scrimIn 0.2s ease',
};

export const sheetStyle: SystemStyleObject = {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  background: 'card',
  borderTop: '1px solid',
  borderColor: 'line',
  borderRadius: '28px 28px 46px 46px',
  padding: '10px 26px 30px',
  boxShadow: '0 -14px 34px -18px rgba(0, 0, 0, 0.4)',
  animation: 'sheetUp 0.28s cubic-bezier(.22,1,.36,1)',
};

export const dragHandleStyle: SystemStyleObject = {
  height: '5px',
  width: '44px',
  background: 'line',
  borderRadius: '3px',
  margin: '0 auto 18px',
};

export const headerRowStyle: SystemStyleObject = {
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '18px',
};

export const titleStyle: SystemStyleObject = {
  fontSize: '19px',
  fontWeight: 700,
  color: 'ink',
};

export const closeButtonStyle: SystemStyleObject = {
  color: 'ink3',
  padding: '4px',
  cursor: 'pointer',
  _hover: {
    color: 'ink',
  },
};

export const rowStyle: SystemStyleObject = {
  alignItems: 'center',
  gap: '14px',
  padding: '14px 16px',
  background: 'sand',
  border: '1px solid',
  borderColor: 'line',
  borderRadius: '18px',
  cursor: 'pointer',
  userSelect: 'none',
};

export const iconSquareStyle: SystemStyleObject = {
  width: '40px',
  height: '40px',
  borderRadius: '12px',
  background: 'card',
  border: '1px solid',
  borderColor: 'line',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

export const iconStyle: SystemStyleObject = {
  fontSize: '20px',
  color: 'ink',
};

export const rowTitleStyle: SystemStyleObject = {
  fontWeight: 700,
  fontSize: '15.5px',
  color: 'ink',
};

export const rowSubtitleStyle: SystemStyleObject = {
  fontSize: '12.5px',
  color: 'ink2',
  marginTop: '1px',
};

// The whole row (not the switch itself) is the click target, matching the
// design - so the switch is purely visual here and shouldn't intercept the
// click before it reaches the row's handler.
export const switchRootStyle: SystemStyleObject = {
  '--switch-width': '48px',
  '--switch-height': '29px',
  pointerEvents: 'none',
};

export const switchControlStyle: SystemStyleObject = {
  background: 'switchOff',
  _checked: {
    background: 'accent',
  },
};

export const switchThumbStyle: SystemStyleObject = {
  background: 'white',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.28)',
};

import type { SystemStyleObject } from '@chakra-ui/react';

export const cardStyle: SystemStyleObject = {
  background: 'card',
  border: '1px solid',
  borderColor: 'line',
  borderRadius: '20px',
  boxShadow: '0 1px 0 rgba(70, 52, 32, 0.03)',
  overflow: 'hidden',
};

export const headerStyle: SystemStyleObject = {
  alignItems: 'center',
  gap: '15px',
  padding: '16px 18px',
  userSelect: 'none',
};

export const clickableHeaderStyle: SystemStyleObject = {
  ...headerStyle,
  cursor: 'pointer',
  _hover: {
    background: 'sand',
  },
};

export const iconSquareStyle: SystemStyleObject = {
  width: '50px',
  height: '50px',
  borderRadius: '15px',
  background: 'sand',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

export const iconStyle: SystemStyleObject = {
  fontSize: '26px',
  color: 'ink',
};

export const titleStyle: SystemStyleObject = {
  fontWeight: 700,
  fontSize: '17px',
  color: 'ink',
};

export const detailStyle: SystemStyleObject = {
  fontSize: '13px',
  color: 'ink2',
  marginTop: '2px',
};

export const badgeStyle: SystemStyleObject = {
  fontSize: '10.5px',
  fontWeight: 700,
  letterSpacing: '0.6px',
  textTransform: 'uppercase',
  padding: '5px 10px',
  borderRadius: '20px',
  flexShrink: 0,
};

export const chevronStyle: SystemStyleObject = {
  marginLeft: '4px',
  color: 'ink3',
  transition: 'transform 0.2s ease',
  flexShrink: 0,
};

export const panelStyle: SystemStyleObject = {
  margin: '0 18px 16px',
  paddingTop: '14px',
  borderTop: '1px solid',
  borderColor: 'line',
  display: 'flex',
  flexDirection: 'column',
  gap: '9px',
};

export const statRowStyle: SystemStyleObject = {
  justifyContent: 'space-between',
  fontSize: '13.5px',
};

export const statLabelStyle: SystemStyleObject = {
  color: 'ink2',
};

export const statValueStyle: SystemStyleObject = {
  fontWeight: 600,
  color: 'ink',
};

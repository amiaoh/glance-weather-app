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

export const scrimClosingStyle: SystemStyleObject = {
  ...scrimStyle,
  animation: 'scrimOut 0.2s ease',
};

export const sheetStyle: SystemStyleObject = {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  background: 'card',
  borderTop: '1px solid',
  borderColor: 'line',
  borderRadius: '28px 28px 0 0',
  padding: '10px 26px 30px',
  boxShadow: '0 -14px 34px -18px rgba(0, 0, 0, 0.4)',
  // Two animations run at once, comma-separated on one `animation` property:
  // the slide handles position, scrimIn fades it in in parallel.
  animation: 'sheetUp 0.28s cubic-bezier(.22,1,.36,1), scrimIn 0.28s ease',
};

export const sheetClosingStyle: SystemStyleObject = {
  ...sheetStyle,
  animation: 'sheetDown 0.22s cubic-bezier(.4,0,1,1), scrimOut 0.22s ease',
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

// The disclosure header and its fields share one card (background/border/
// radius live here) so the fields read as part of the same row they expand
// from, rather than a separate box floating underneath it.
export const thresholdsCardStyle: SystemStyleObject = {
  marginTop: '0.75rem',
  background: 'sand',
  border: '1px solid',
  borderColor: 'line',
  borderRadius: '1.125rem',
  overflow: 'hidden',
};

export const thresholdsHeaderStyle: SystemStyleObject = {
  alignItems: 'center',
  gap: '0.875rem',
  padding: '0.875rem 1rem',
  cursor: 'pointer',
  userSelect: 'none',
};

// Animates the fields open/closed via the grid-template-rows 0fr/1fr trick -
// transitions smoothly without knowing the content's height up front, unlike
// a max-height animation. The inner box's overflow:hidden is what actually
// clips the content while the 0fr row is collapsing.
export const thresholdsCollapseStyle: SystemStyleObject = {
  display: 'grid',
  transition: 'grid-template-rows 0.25s ease',
};

export const thresholdsCollapseInnerStyle: SystemStyleObject = {
  overflow: 'hidden',
  minHeight: 0,
};

export const thresholdsPanelStyle: SystemStyleObject = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.625rem',
  borderTop: '1px solid',
  borderColor: 'line',
  padding: '0.875rem 1rem',
};

export const fieldRowStyle: SystemStyleObject = {
  alignItems: 'center',
  gap: '0.75rem',
};

export const fieldLabelStyle: SystemStyleObject = {
  flex: 1,
  fontSize: '0.875rem',
  fontWeight: 600,
  color: 'ink',
};

export const fieldUnitStyle: SystemStyleObject = {
  fontSize: '0.75rem',
  color: 'ink3',
  minWidth: '2.5rem',
};

export const numberInputRootStyle: SystemStyleObject = {
  display: 'flex',
  alignItems: 'stretch',
  width: '6.75rem',
  background: 'card',
  border: '1px solid',
  borderColor: 'line',
  borderRadius: '0.75rem',
  overflow: 'hidden',
  // The `padding` shorthand below clears Chakra's recipe default of a large
  // paddingInlineEnd (reserved for a stepper it normally absolute-positions
  // on top of the input) - numberInputControlStyle instead puts the stepper
  // in normal flex flow beside the input, so that reservation isn't needed.
  '& input': {
    width: '100%',
    minWidth: 0,
    padding: '0.375rem 0.625rem',
    fontSize: '0.875rem',
    color: 'ink',
    background: 'transparent',
    border: 'none',
    textAlign: 'right',
  },
};

export const numberInputControlStyle: SystemStyleObject = {
  // Overrides the recipe's default `position: absolute` (which stacks the
  // stepper on top of the input, causing it to overlap the digits) so it
  // instead sits beside the input as a normal flex sibling.
  position: 'static',
  margin: 0,
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  width: '1.75rem',
  borderLeft: '1px solid',
  borderColor: 'line',
  '& button': {
    flex: 1,
    width: '100%',
    color: 'ink2',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
};

export const resetRowStyle: SystemStyleObject = {
  alignSelf: 'flex-start',
  marginTop: '0.25rem',
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: 'accent',
  cursor: 'pointer',
  userSelect: 'none',
};

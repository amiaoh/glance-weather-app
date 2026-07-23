import type { SystemStyleObject } from '@chakra-ui/react';

// Chakra's Skeleton shimmers its own background - iconSquareStyle's fixed
// "sand" background would override that, so size/shape only.
export const iconSkeletonStyle: SystemStyleObject = {
  width: '3.125rem',
  height: '3.125rem',
  borderRadius: '0.9375rem',
  flexShrink: 0,
};

export const titleSkeletonStyle: SystemStyleObject = {
  width: '7.5rem',
  height: '1.0625rem',
  borderRadius: '0.25rem',
};

export const detailSkeletonStyle: SystemStyleObject = {
  width: '11rem',
  height: '0.8125rem',
  borderRadius: '0.25rem',
  marginTop: '0.375rem',
};

export const badgeSkeletonStyle: SystemStyleObject = {
  width: '3rem',
  height: '1.375rem',
  borderRadius: '1.25rem',
  flexShrink: 0,
};

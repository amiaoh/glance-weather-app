import { Box } from '@chakra-ui/react';
import { GearCardSkeleton } from './GearCardSkeleton';
import { containerStyle, listStyle } from './GearRecommendation.styles';

export function GearRecommendationSkeleton() {
  return (
    <Box css={containerStyle}>
      <Box css={listStyle}>
        <GearCardSkeleton />
        <GearCardSkeleton />
      </Box>
    </Box>
  );
}

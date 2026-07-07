import { Box, Text } from '@chakra-ui/react';
import type { GearRecommendation as GearRecommendationData } from '../../types/weather';
import { GearCard } from './GearCard';
import { containerStyle, labelStyle, listStyle } from './GearRecommendation.styles';

interface GearRecommendationProps {
  gear: GearRecommendationData[];
}

export function GearRecommendation({ gear }: GearRecommendationProps) {
  return (
    <Box css={containerStyle}>
      <Text css={labelStyle}>You'll want</Text>
      <Box css={listStyle}>
        {gear.map((item) => (
          <GearCard key={item.level} item={item} />
        ))}
      </Box>
    </Box>
  );
}

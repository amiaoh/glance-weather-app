import { Box, Flex, Icon, Text } from '@chakra-ui/react';
import { FiCheckCircle } from 'react-icons/fi';
import { WiDaySunny, WiStrongWind, WiUmbrella } from 'react-icons/wi';
import type { GearLevel, GearRecommendation as GearRecommendationData } from '../../types/weather';
import {
  LEVEL_COLOR,
  containerStyle,
  detailStyle,
  iconStyle,
  labelStyle,
  rowStyle,
} from './GearRecommendation.styles';

interface GearRecommendationProps {
  gear: GearRecommendationData;
}

const ICONS: Record<GearLevel, React.ComponentType> = {
  none: FiCheckCircle,
  sun: WiDaySunny,
  umbrella: WiUmbrella,
  'wet-weather-gear': WiUmbrella,
  windbreaker: WiStrongWind,
};

export function GearRecommendation({ gear }: GearRecommendationProps) {
  const color = LEVEL_COLOR[gear.level];

  return (
    <Box css={{ ...containerStyle, borderLeftColor: color }}>
      <Flex css={rowStyle}>
        <Icon as={ICONS[gear.level]} css={{ ...iconStyle, color }} />
        <Box>
          <Text css={labelStyle}>{gear.label}</Text>
          <Text css={detailStyle}>{gear.detail}</Text>
        </Box>
      </Flex>
    </Box>
  );
}

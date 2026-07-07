import { Box, Flex, Icon, Text } from '@chakra-ui/react';
import { FiCheckCircle } from 'react-icons/fi';
import { TbJacket } from 'react-icons/tb';
import { WiDaySunny, WiRainWind, WiStrongWind, WiUmbrella } from 'react-icons/wi';
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
  gear: GearRecommendationData[];
}

const ICONS: Record<GearLevel, React.ComponentType> = {
  none: FiCheckCircle,
  sun: WiDaySunny,
  umbrella: WiUmbrella,
  'wet-weather-gear': WiRainWind,
  jacket: TbJacket,
  windbreaker: WiStrongWind,
};

export function GearRecommendation({ gear }: GearRecommendationProps) {
  const topColor = LEVEL_COLOR[gear[0].level];

  return (
    <Box css={{ ...containerStyle, borderLeftColor: topColor }}>
      {gear.map((item) => (
        <Flex key={item.level} css={rowStyle}>
          <Icon as={ICONS[item.level]} css={{ ...iconStyle, color: LEVEL_COLOR[item.level] }} />
          <Box>
            <Text css={labelStyle}>{item.label}</Text>
            <Text css={detailStyle}>{item.detail}</Text>
          </Box>
        </Flex>
      ))}
    </Box>
  );
}

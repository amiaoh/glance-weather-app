import { Box, Flex, Text } from '@chakra-ui/react';
import { FiCheckCircle } from 'react-icons/fi';
import { WiDaySunny, WiStrongWind, WiUmbrella } from 'react-icons/wi';
import type { GearLevel, GearRecommendation as GearRecommendationData } from '../../types/weather';
import styles from './GearRecommendation.module.css';

interface GearRecommendationProps {
  gear: GearRecommendationData;
}

const ICONS: Record<GearLevel, React.ComponentType<{ className?: string }>> = {
  none: FiCheckCircle,
  sun: WiDaySunny,
  umbrella: WiUmbrella,
  'wet-weather-gear': WiUmbrella,
  windbreaker: WiStrongWind,
};

const LEVEL_CLASS: Record<GearLevel, string> = {
  none: styles.levelNone,
  sun: styles.levelSun,
  umbrella: styles.levelUmbrella,
  'wet-weather-gear': styles.levelWetWeather,
  windbreaker: styles.levelWindbreaker,
};

export function GearRecommendation({ gear }: GearRecommendationProps) {
  const Icon = ICONS[gear.level];

  return (
    <Box className={`${styles.container} ${LEVEL_CLASS[gear.level]}`}>
      <Flex className={styles.row}>
        <Icon className={styles.icon} />
        <Box>
          <Text className={styles.label}>{gear.label}</Text>
          <Text className={styles.detail}>{gear.detail}</Text>
        </Box>
      </Flex>
    </Box>
  );
}

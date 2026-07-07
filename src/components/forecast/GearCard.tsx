import { useState } from 'react';
import { Box, Flex, Icon, Text } from '@chakra-ui/react';
import { LuChevronDown, LuCircleCheck, LuCloudRainWind, LuSun, LuUmbrella, LuWind } from 'react-icons/lu';
import { TbJacket } from 'react-icons/tb';
import type { GearLevel, GearRecommendation, SeverityTier } from '../../types/weather';
import {
  badgeStyle,
  cardStyle,
  chevronStyle,
  clickableHeaderStyle,
  detailStyle,
  headerStyle,
  iconSquareStyle,
  iconStyle,
  panelStyle,
  statLabelStyle,
  statRowStyle,
  statValueStyle,
  titleStyle,
} from './GearCard.styles';

const ICONS: Record<GearLevel, React.ComponentType> = {
  none: LuCircleCheck,
  sun: LuSun,
  umbrella: LuUmbrella,
  'wet-weather-gear': LuCloudRainWind,
  jacket: TbJacket,
  windbreaker: LuWind,
};

const SEVERITY_COLORS: Record<SeverityTier, { fg: string; bg: string }> = {
  mild: { fg: 'severity.mild.fg', bg: 'severity.mild.bg' },
  moderate: { fg: 'severity.moderate.fg', bg: 'severity.moderate.bg' },
  high: { fg: 'severity.high.fg', bg: 'severity.high.bg' },
  veryHigh: { fg: 'severity.veryHigh.fg', bg: 'severity.veryHigh.bg' },
  extreme: { fg: 'severity.extreme.fg', bg: 'severity.extreme.bg' },
};

interface GearCardProps {
  item: GearRecommendation;
}

export function GearCard({ item }: GearCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasDetails = !!item.stats?.length;

  return (
    <Box css={cardStyle}>
      <Flex
        css={hasDetails ? clickableHeaderStyle : headerStyle}
        onClick={hasDetails ? () => setIsOpen((open) => !open) : undefined}
      >
        <Flex css={iconSquareStyle}>
          <Icon as={ICONS[item.level]} css={iconStyle} />
        </Flex>
        <Box flex={1}>
          <Text css={titleStyle}>{item.label}</Text>
          <Text css={detailStyle}>{item.detail}</Text>
        </Box>
        {item.severity && (
          <Text css={{ ...badgeStyle, color: SEVERITY_COLORS[item.severity.tier].fg, background: SEVERITY_COLORS[item.severity.tier].bg }}>
            {item.severity.label}
          </Text>
        )}
        {hasDetails && (
          <Icon as={LuChevronDown} css={{ ...chevronStyle, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        )}
      </Flex>
      {isOpen && hasDetails && (
        <Box css={panelStyle}>
          {item.stats!.map((stat) => (
            <Flex key={stat.label} css={statRowStyle}>
              <Text css={statLabelStyle}>{stat.label}</Text>
              <Text css={statValueStyle}>{stat.value}</Text>
            </Flex>
          ))}
        </Box>
      )}
    </Box>
  );
}

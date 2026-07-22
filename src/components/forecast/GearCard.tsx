import { Box, Flex, Icon, Text } from '@chakra-ui/react';
import { LuChevronDown, LuCircleCheck, LuCloudRainWind, LuSun, LuUmbrella, LuWind } from 'react-icons/lu';
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
  uvBadgeStyle,
} from './GearCard.styles';

import { useState } from 'react';
import { TbJacket } from 'react-icons/tb';

const ICONS: Record<GearLevel, React.ComponentType> = {
  none: LuCircleCheck,
  sun: LuSun,
  umbrella: LuUmbrella,
  'waterproof-gear': LuCloudRainWind,
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

// ARPANSA UV Index band colors, used instead of SEVERITY_COLORS when a
// severity is UV-scaled.
const UV_COLORS: Record<SeverityTier, { fg: string; bg: string }> = {
  mild: { fg: 'uv.low.fg', bg: 'uv.low.bg' },
  moderate: { fg: 'uv.moderate.fg', bg: 'uv.moderate.bg' },
  high: { fg: 'uv.high.fg', bg: 'uv.high.bg' },
  veryHigh: { fg: 'uv.veryHigh.fg', bg: 'uv.veryHigh.bg' },
  extreme: { fg: 'uv.extreme.fg', bg: 'uv.extreme.bg' },
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
        {item.severity && (() => {
          const isUV = item.severity.scale === 'uv';
          const colors = isUV ? UV_COLORS[item.severity.tier] : SEVERITY_COLORS[item.severity.tier];
          return (
            <Text css={{ ...(isUV ? uvBadgeStyle : badgeStyle), color: colors.fg, background: colors.bg }}>
              {item.severity.label}
            </Text>
          );
        })()}
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

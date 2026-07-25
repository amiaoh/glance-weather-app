import {
  Box,
  Flex,
  Icon,
  NumberInputControl,
  NumberInputDecrementTrigger,
  NumberInputIncrementTrigger,
  NumberInputInput,
  NumberInputRoot,
  SwitchControl,
  SwitchHiddenInput,
  SwitchRoot,
  SwitchThumb,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { LuChevronDown, LuMoon, LuSlidersHorizontal, LuX } from 'react-icons/lu';
import { useColorMode } from '../../hooks/useColorMode';
import { useThresholds } from '../../hooks/useThresholds';
import type { WarningThresholds } from '../../types/weather';
import {
  closeButtonStyle,
  dragHandleStyle,
  fieldLabelStyle,
  fieldRowStyle,
  fieldUnitStyle,
  headerRowStyle,
  iconSquareStyle,
  iconStyle,
  numberInputControlStyle,
  numberInputRootStyle,
  overlayStyle,
  resetRowStyle,
  rowStyle,
  rowSubtitleStyle,
  rowTitleStyle,
  scrimClosingStyle,
  scrimStyle,
  sheetClosingStyle,
  sheetStyle,
  switchControlStyle,
  switchRootStyle,
  switchThumbStyle,
  thresholdsCardStyle,
  thresholdsCollapseInnerStyle,
  thresholdsCollapseStyle,
  thresholdsHeaderStyle,
  thresholdsPanelStyle,
  titleStyle,
} from './SettingsSheet.styles';

interface ThresholdField {
  key: keyof WarningThresholds;
  label: string;
  unit: string;
  min?: number;
  step: number;
}

const THRESHOLD_FIELDS: ThresholdField[] = [
  { key: 'coldBelowC', label: 'Cold below', unit: '°C', step: 1 },
  { key: 'rainModerateFromMm', label: 'Moderate rain from', unit: 'mm', min: 0, step: 0.5 },
  { key: 'rainHeavyFromMm', label: 'Heavy rain from', unit: 'mm', min: 0, step: 0.5 },
  { key: 'windModerateFromKmh', label: 'Moderate wind from', unit: 'km/h', min: 0, step: 1 },
  { key: 'windStrongFromKmh', label: 'Strong wind from', unit: 'km/h', min: 0, step: 1 },
];

interface SettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

// Must match the sheetDown/scrimOut durations in SettingsSheet.styles.ts -
// the sheet stays mounted for this long after isOpen goes false so the
// slide-away animation can finish before it's removed from the DOM.
const CLOSE_ANIMATION_MS = 220;

export function SettingsSheet({ isOpen, onClose }: SettingsSheetProps) {
  const { colorMode, toggleColorMode } = useColorMode();
  const { thresholds, setThreshold, resetThresholds } = useThresholds();
  const [thresholdsOpen, setThresholdsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      setIsClosing(false);
      return;
    }

    if (!isMounted) return;

    setIsClosing(true);
    const timer = setTimeout(() => {
      setIsMounted(false);
      setIsClosing(false);
    }, CLOSE_ANIMATION_MS);
    return () => clearTimeout(timer);
  }, [isOpen, isMounted]);

  if (!isMounted) return null;

  return (
    <Box css={overlayStyle}>
      <Box css={isClosing ? scrimClosingStyle : scrimStyle} onClick={onClose} />
      <Box css={isClosing ? sheetClosingStyle : sheetStyle}>
        <Box css={dragHandleStyle} />
        <Flex css={headerRowStyle}>
          <Text css={titleStyle}>Settings</Text>
          <Flex css={closeButtonStyle} onClick={onClose} aria-label="Close settings" role="button">
            <LuX size={20} />
          </Flex>
        </Flex>

        <Flex css={rowStyle} onClick={toggleColorMode} role="button" aria-label="Toggle dark mode">
          <Flex css={iconSquareStyle}>
            <Icon as={LuMoon} css={iconStyle} />
          </Flex>
          <Box flex={1}>
            <Text css={rowTitleStyle}>Dark mode</Text>
            <Text css={rowSubtitleStyle}>Easier on the eyes at night</Text>
          </Box>
          <SwitchRoot css={switchRootStyle} checked={colorMode === 'dark'} readOnly>
            <SwitchHiddenInput />
            <SwitchControl css={switchControlStyle}>
              <SwitchThumb css={switchThumbStyle} />
            </SwitchControl>
          </SwitchRoot>
        </Flex>

        <Box css={thresholdsCardStyle}>
          <Flex
            css={thresholdsHeaderStyle}
            onClick={() => setThresholdsOpen((open) => !open)}
            role="button"
            aria-expanded={thresholdsOpen}
            aria-label="Customise warning thresholds"
          >
            <Flex css={iconSquareStyle}>
              <Icon as={LuSlidersHorizontal} css={iconStyle} />
            </Flex>
            <Box flex={1}>
              <Text css={rowTitleStyle}>Customise warning thresholds</Text>
              <Text css={rowSubtitleStyle}>Tune what counts as cold, rainy, or windy</Text>
            </Box>
            <Icon
              as={LuChevronDown}
              css={{
                ...iconStyle,
                transform: thresholdsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            />
          </Flex>

          <Box css={{ ...thresholdsCollapseStyle, gridTemplateRows: thresholdsOpen ? '1fr' : '0fr' }}>
            <Box css={thresholdsCollapseInnerStyle} aria-hidden={!thresholdsOpen}>
              <Box css={thresholdsPanelStyle}>
                {THRESHOLD_FIELDS.map((field) => (
                  <Flex key={field.key} css={fieldRowStyle}>
                    <Text css={fieldLabelStyle}>{field.label}</Text>
                    <NumberInputRoot
                      css={numberInputRootStyle}
                      value={String(thresholds[field.key])}
                      min={field.min}
                      step={field.step}
                      onValueChange={(details) => {
                        if (!Number.isNaN(details.valueAsNumber)) {
                          setThreshold(field.key, details.valueAsNumber);
                        }
                      }}
                    >
                      <NumberInputInput tabIndex={thresholdsOpen ? 0 : -1} />
                      <NumberInputControl css={numberInputControlStyle}>
                        <NumberInputIncrementTrigger tabIndex={-1} />
                        <NumberInputDecrementTrigger tabIndex={-1} />
                      </NumberInputControl>
                    </NumberInputRoot>
                    <Text css={fieldUnitStyle}>{field.unit}</Text>
                  </Flex>
                ))}
                <Flex css={resetRowStyle} onClick={resetThresholds} role="button" aria-label="Reset thresholds to defaults">
                  <Text>Reset to defaults</Text>
                </Flex>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

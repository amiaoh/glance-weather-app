import { Box, Flex, Icon, SwitchControl, SwitchHiddenInput, SwitchRoot, SwitchThumb, Text } from '@chakra-ui/react';
import { LuMoon, LuX } from 'react-icons/lu';
import { useColorMode } from '../../hooks/useColorMode';
import {
  closeButtonStyle,
  dragHandleStyle,
  headerRowStyle,
  iconSquareStyle,
  iconStyle,
  overlayStyle,
  rowStyle,
  rowSubtitleStyle,
  rowTitleStyle,
  scrimStyle,
  sheetStyle,
  switchControlStyle,
  switchRootStyle,
  switchThumbStyle,
  titleStyle,
} from './SettingsSheet.styles';

interface SettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsSheet({ isOpen, onClose }: SettingsSheetProps) {
  const { colorMode, toggleColorMode } = useColorMode();

  if (!isOpen) return null;

  return (
    <Box css={overlayStyle}>
      <Box css={scrimStyle} onClick={onClose} />
      <Box css={sheetStyle}>
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
      </Box>
    </Box>
  );
}

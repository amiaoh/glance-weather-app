import { Flex, IconButton, NativeSelect, Text } from '@chakra-ui/react';
import { FiMapPin, FiNavigation, FiRefreshCw } from 'react-icons/fi';
import { AUSTRALIAN_CITIES } from '../../utils/cityCoordinates';
import { useLocation } from '../../hooks/useLocation';
import {
  citySelectFieldStyle,
  headerStyle,
  iconButtonStyle,
  sideGroupStyle,
  spinningStyle,
  updatedStyle,
} from './Header.styles';

interface HeaderProps {
  lastUpdated: Date | null;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function Header({ lastUpdated, onRefresh, isRefreshing }: HeaderProps) {
  const { city, isLocating, detectLocation, setCity } = useLocation();

  return (
    <Flex as="header" css={headerStyle}>
      <Flex css={sideGroupStyle}>
        <NativeSelect.Root size="sm">
          <NativeSelect.Field
            css={citySelectFieldStyle}
            value={city.name}
            onChange={(e) => setCity(e.target.value)}
            aria-label="Select city"
          >
            {AUSTRALIAN_CITIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>

        <IconButton
          css={{ ...iconButtonStyle, ...(isLocating ? spinningStyle : {}) }}
          onClick={detectLocation}
          disabled={isLocating}
          title="Use my location"
          aria-label="Use my location"
          variant="ghost"
          size="sm"
        >
          {isLocating ? <FiNavigation /> : <FiMapPin />}
        </IconButton>
      </Flex>

      <Flex css={sideGroupStyle}>
        {lastUpdated && (
          <Text css={updatedStyle} title={`Last updated: ${lastUpdated.toLocaleString()}`}>
            {`Updated ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
          </Text>
        )}
        <IconButton
          css={{ ...iconButtonStyle, ...(isRefreshing ? spinningStyle : {}) }}
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh weather data"
          aria-label="Refresh weather data"
          variant="ghost"
          size="sm"
        >
          <FiRefreshCw />
        </IconButton>
      </Flex>
    </Flex>
  );
}

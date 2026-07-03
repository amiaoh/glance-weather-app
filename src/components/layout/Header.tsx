import { Flex, IconButton, NativeSelect, Text } from '@chakra-ui/react';
import { FiMapPin, FiNavigation, FiRefreshCw } from 'react-icons/fi';
import { AUSTRALIAN_CITIES } from '../../utils/cityCoordinates';
import { useLocation } from '../../hooks/useLocation';
import styles from './Header.module.css';

interface HeaderProps {
  lastUpdated: Date | null;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function Header({ lastUpdated, onRefresh, isRefreshing }: HeaderProps) {
  const { city, isLocating, detectLocation, setCity } = useLocation();

  return (
    <Flex as="header" className={styles.header}>
      <Flex className={styles.left}>
        <NativeSelect.Root size="sm" className={styles.citySelect}>
          <NativeSelect.Field
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
          className={`${styles.iconButton} ${isLocating ? styles.spinning : ''}`}
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

      <Flex className={styles.right}>
        {lastUpdated && (
          <Text className={styles.updated} title={`Last updated: ${lastUpdated.toLocaleString()}`}>
            {`Updated ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
          </Text>
        )}
        <IconButton
          className={`${styles.iconButton} ${isRefreshing ? styles.spinning : ''}`}
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

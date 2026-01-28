import { Box, Flex, Text } from '@chakra-ui/react';
import styles from './Header.module.css';

interface HeaderProps {
  lastUpdated: Date | null;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function Header({ lastUpdated, onRefresh, isRefreshing }: HeaderProps) {
  return (
    <Box as="header" className={styles.header}>
      <Flex className={styles.right}>
        {lastUpdated && (
          <Text className={styles.updated} title={`Last updated: ${lastUpdated.toLocaleString()}`}>
            {`Last updated at ${lastUpdated.getTime().toString() === 'Invalid Date' ? '' : lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
          </Text>
        )}
        <button
          className={`${styles.refreshButton} ${isRefreshing ? styles.spinning : ''}`}
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh weather data"
          aria-label="Refresh weather data"
        >
          ↻
        </button>
      </Flex>
      {/* placeholder for About section */}
    </Box>
  );
}

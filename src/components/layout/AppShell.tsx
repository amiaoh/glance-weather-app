import type { ReactNode } from 'react';
import { Box } from '@chakra-ui/react';
import styles from './AppShell.module.css';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return <Box className={styles.shell}>{children}</Box>;
}

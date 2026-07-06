import type { ReactNode } from 'react';
import { Box } from '@chakra-ui/react';
import { shellStyle } from './AppShell.styles';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return <Box css={shellStyle}>{children}</Box>;
}

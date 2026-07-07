import { createSystem, defaultConfig } from '@chakra-ui/react';
import type { SystemConfig } from '@chakra-ui/react';

// Color values migrated from src/styles/variables.css. Kept as semantic
// tokens (rather than plain tokens) so light/dark variants can be added
// later without touching component code.
const config: SystemConfig = {
  theme: {
    keyframes: {
      spin: {
        to: { transform: 'rotate(360deg)' },
      },
    },
    tokens: {
      colors: {
        accent: { value: '#e94560' },
        cold: { value: '#78909C' },
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          primary: { value: { base: '#f5f5f5' } },
          secondary: { value: { base: '#ffffff' } },
          now: { value: { base: 'rgb(232, 230, 230)' } },
          highlight: { value: { base: '#d0d0d0' } },
        },
        text: {
          primary: { value: { base: '#1a1a2e' } },
          secondary: { value: { base: '#555555' } },
          muted: { value: { base: '#888888' } },
        },
        border: {
          DEFAULT: { value: { base: 'rgba(0, 0, 0, 0.1)' } },
        },
        // UV colors (WHO standard)
        uv: {
          low: { value: { base: '#4CAF50' } },
          moderate: { value: { base: '#FFEB3B' } },
          high: { value: { base: '#FF9800' } },
          veryHigh: { value: { base: '#F44336' } },
          extreme: { value: { base: '#9C27B0' } },
        },
        rain: {
          light: { value: { base: '#64B5F6' } },
          moderate: { value: { base: '#42A5F5' } },
          heavy: { value: { base: '#1E88E5' } },
        },
      },
    },
  },
};

export const system = createSystem(defaultConfig, config);

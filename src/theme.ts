import { createSystem, defaultConfig } from '@chakra-ui/react';
import type { SystemConfig } from '@chakra-ui/react';

// Palette matches the Claude Design mockup's CSS variables 1:1 (page, card,
// ink/ink2/ink3, line, sand, accent, amber, sage, switchOff, severity.*) so
// future design updates can be ported by name rather than re-derived.
const config: SystemConfig = {
  theme: {
    keyframes: {
      spin: {
        to: { transform: 'rotate(360deg)' },
      },
      scrimIn: {
        from: { opacity: 0 },
        to: { opacity: 1 },
      },
      sheetUp: {
        from: { transform: 'translateY(100%)' },
        to: { transform: 'translateY(0)' },
      },
    },
    tokens: {
      colors: {
        cold: { value: '#78909C' },
      },
    },
    semanticTokens: {
      colors: {
        page: { value: { base: '#EDE4D4', _dark: '#161310' } },
        card: { value: { base: '#FFFDF8', _dark: '#221E18' } },
        ink: { value: { base: '#302A23', _dark: '#ECE4D6' } },
        ink2: { value: { base: '#7A7063', _dark: '#ADA491' } },
        ink3: { value: { base: '#A79C8B', _dark: '#7C7365' } },
        line: { value: { base: '#EAE1D1', _dark: '#38322A' } },
        sand: { value: { base: '#F0E7D7', _dark: '#2C271F' } },
        amber: { value: { base: '#B78526', _dark: '#D9A94E' } },
        sage: { value: { base: '#788A57', _dark: '#9DAE72' } },
        accent: { value: { base: '#B25E3B', _dark: '#C77E56' } },
        switchOff: { value: { base: '#D8CFBF', _dark: '#4A4239' } },
        // 5-tier severity badge ramp. "moderate" and "extreme" are the exact
        // colors from the design file; "mild", "high", and "veryHigh" are
        // interpolated between them (mild borrows the sage hue used
        // elsewhere for calm/positive states) so every tier stays within
        // the design's warm palette rather than introducing new hues.
        severity: {
          mild: {
            fg: { value: { base: '#5C6B3F', _dark: '#B7C48D' } },
            bg: { value: { base: '#E8ECDA', _dark: '#262C1C' } },
          },
          moderate: {
            fg: { value: { base: '#8a6516', _dark: '#D8B265' } },
            bg: { value: { base: '#F5E9C9', _dark: '#332B1A' } },
          },
          high: {
            fg: { value: { base: '#8A5B22', _dark: '#DDAF6E' } },
            bg: { value: { base: '#F5E6CD', _dark: '#352B1C' } },
          },
          veryHigh: {
            fg: { value: { base: '#895128', _dark: '#E1AC78' } },
            bg: { value: { base: '#F4E4D0', _dark: '#382A1F' } },
          },
          extreme: {
            fg: { value: { base: '#8a4a2e', _dark: '#E6A981' } },
            bg: { value: { base: '#F4E1D4', _dark: '#3A2A21' } },
          },
        },
        rain: {
          light: { value: { base: '#64B5F6' } },
          moderate: { value: { base: '#42A5F5' } },
          heavy: { value: { base: '#1E88E5' } },
        },
        // ARPANSA UV Index bands (arpansa.gov.au) - green/yellow/orange/red/violet,
        // distinct from the warm severity ramp above since this scale is a
        // recognized external standard, not an app-specific tier.
        uv: {
          low: {
            fg: { value: { base: '#2E7D32', _dark: '#A5D6A7' } },
            bg: { value: { base: '#DCEDC8', _dark: '#1E3620' } },
          },
          moderate: {
            fg: { value: { base: '#8F6A00', _dark: '#F0D264' } },
            bg: { value: { base: '#FDF3C7', _dark: '#3A3110' } },
          },
          high: {
            fg: { value: { base: '#B35900', _dark: '#FFA85C' } },
            bg: { value: { base: '#FCE0C2', _dark: '#402A12' } },
          },
          veryHigh: {
            fg: { value: { base: '#B0271E', _dark: '#F1897F' } },
            bg: { value: { base: '#F8D6D3', _dark: '#3D1815' } },
          },
          extreme: {
            fg: { value: { base: '#7B2D8B', _dark: '#D599E0' } },
            bg: { value: { base: '#EEDBF3', _dark: '#331539' } },
          },
        },
      },
    },
  },
};

export const system = createSystem(defaultConfig, config);

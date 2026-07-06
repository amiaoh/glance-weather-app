import { NativeSelect } from '@chakra-ui/react';
import { PREVIEW_SCENARIOS } from './previewScenarios';
import { toggleFieldStyle, toggleStyle } from './DevPreviewToggle.styles';

interface DevPreviewToggleProps {
  scenarioId: string;
  onChange: (id: string) => void;
}

export function DevPreviewToggle({ scenarioId, onChange }: DevPreviewToggleProps) {
  if (!import.meta.env.DEV) return null;

  return (
    <NativeSelect.Root size="xs" css={toggleStyle}>
      <NativeSelect.Field
        css={toggleFieldStyle}
        value={scenarioId}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Preview scenario"
      >
        <option value="off">Live data</option>
        {PREVIEW_SCENARIOS.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  );
}

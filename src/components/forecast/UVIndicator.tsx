import styles from './UVIndicator.module.css';

interface UVIndicatorProps {
  value: number | null;
}

function getUVLevel(uv: number): { level: string; className: string } {
  if (uv <= 2) return { level: 'Low', className: styles.low };
  if (uv <= 5) return { level: 'Mod', className: styles.moderate };
  if (uv <= 7) return { level: 'High', className: styles.high };
  if (uv <= 10) return { level: 'V.High', className: styles.veryHigh };
  return { level: 'Ext', className: styles.extreme };
}

export function UVIndicator({ value }: UVIndicatorProps) {
  if (value === null) {
    return <div className={`${styles.indicator} ${styles.none}`}>-</div>;
  }

  const { className } = getUVLevel(value);
  const displayValue = Math.round(value);

  return (
    <div className={`${styles.indicator} ${className}`} title={`UV Index: ${displayValue}`}>
      {displayValue}
    </div>
  );
}

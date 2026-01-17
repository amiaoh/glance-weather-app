import { useLocation } from './LocationContext';
import styles from './GPSButton.module.css';

export function GPSButton() {
  const { detectLocation, isLocating } = useLocation();

  return (
    <button
      className={styles.button}
      onClick={detectLocation}
      disabled={isLocating}
      aria-label="Detect location"
      title="Use GPS"
    >
      {isLocating ? (
        <span className={styles.spinner} />
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
        </svg>
      )}
    </button>
  );
}

import styles from './Header.module.css';

interface HeaderProps {
  lastUpdated: Date | null;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function Header({ lastUpdated, onRefresh, isRefreshing }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.right}>
        {lastUpdated && (
          <span className={styles.updated} title={`Last updated: ${lastUpdated.toLocaleString()}`}>
            {`Last updated at ${lastUpdated.getTime().toString() === 'Invalid Date' ? '' : lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
          </span>
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
      </div>
      {/* placeholder for About section */}
    </header>
  );
}

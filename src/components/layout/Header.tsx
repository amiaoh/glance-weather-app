import styles from './Header.module.css';

interface HeaderProps {
  lastUpdated: Date | null;
}

export function Header({ lastUpdated }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.right}>
        {lastUpdated && (
          <span className={styles.updated} title={`Last updated: ${lastUpdated.toLocaleString()}`}>
            {`Last updated at ${lastUpdated.getTime().toString() === 'Invalid Date' ? '' : lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
          </span>
        )}
      </div>
      {/* placeholder for About section */}
    </header>
  );
}

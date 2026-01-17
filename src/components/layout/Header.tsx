import { GPSButton } from '../location/GPSButton';
import { LocationSelector } from '../location/LocationSelector';
import styles from './Header.module.css';

interface HeaderProps {
  lastUpdated: Date | null;
}

function formatLastUpdated(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Updated just now';
  if (diffMins === 1) return 'Updated 1 min ago';
  if (diffMins < 60) return `Updated ${diffMins} mins ago`;

  return date.toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit' });
}

export function Header({ lastUpdated }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <LocationSelector />
        <GPSButton />
      </div>
      <div className={styles.right}>
        {lastUpdated && (
          <span className={styles.updated} title={`Last updated: ${lastUpdated.toLocaleString()}`}>
            {formatLastUpdated(lastUpdated)}
          </span>
        )}
      </div>
    </header>
  );
}

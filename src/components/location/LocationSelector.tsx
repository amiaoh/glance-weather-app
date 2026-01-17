import { useLocation } from './LocationContext';
import { AUSTRALIAN_CITIES } from '../../utils/cityCoordinates';
import styles from './LocationSelector.module.css';

export function LocationSelector() {
  const { city, setCity } = useLocation();

  return (
    <select
      className={styles.select}
      value={city.name}
      onChange={e => setCity(e.target.value)}
      aria-label="Select city"
    >
      {AUSTRALIAN_CITIES.map(c => (
        <option key={c.name} value={c.name}>
          {c.name}, {c.state}
        </option>
      ))}
    </select>
  );
}

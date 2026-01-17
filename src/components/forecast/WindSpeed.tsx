import styles from './WindSpeed.module.css';

interface WindSpeedProps {
  value: number;
}

export function WindSpeed({ value }: WindSpeedProps) {
  return (
    <div className={styles.wind} title={`Wind: ${value} km/h`}>
      {/* <svg className={styles.icon} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
        <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
        <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
      </svg> */}
      <span className={styles.value}>{`${value} km/h`}</span>
    </div>
  );
}

//Calm to Gentle Breeze - 0 to 19 kph, Moderate to Strong Winds (20–49 km/h,
//  Gale Force Winds (50–88 km/h, Storm to Hurricane Force ( / 89+ km/h) 

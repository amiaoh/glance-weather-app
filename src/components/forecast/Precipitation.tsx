import styles from './Precipitation.module.css';

interface PrecipitationProps {
  probability: number;
  amount: number;
}

//<2.5mm light, 2.5-10mm moderate, 10-50mm heavy, >50mm violent

export function Precipitation({ probability, amount }: PrecipitationProps) {
  const noChancePrecipitation = probability === 0 && amount === 0;
 const displayAmount = amount === 0 ? '<0.1' : amount;

  return (
    <div className={styles.container}>
      <div className={styles.precipitationStats}>
        <span >{`${probability}%`}</span>
        {noChancePrecipitation ? null : <span>{`${displayAmount}mm`}</span>}
      </div>
    </div>
  );
}

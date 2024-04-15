// Import CSS module
import styles from './locationBtn.module.css';

const LocationButton = ({ onClickHandler }) => {
  return (
    <button className={styles.locationButton} onClick={onClickHandler}>
      <div className={styles.outerCircle}>
        <div className={styles.innerCircle}></div>
        <div className={styles.north + ' ' + styles.direction}></div>
        <div className={styles.south + ' ' + styles.direction}></div>
        <div className={styles.east + ' ' + styles.direction}></div>
        <div className={styles.west + ' ' + styles.direction}></div>
      </div>
    </button>
  );
};

export default LocationButton;

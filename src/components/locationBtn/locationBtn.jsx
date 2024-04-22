import styles from './locationBtn.module.css';
import Tooltip from '@mui/material/Tooltip';

const LocationButton = ({ onClickHandler }) => {
  return (
    <Tooltip title="Use my location" placement="right">
      <button className={styles.locationButton} onClick={onClickHandler}>
        <div className={styles.outerCircle}>
          <div className={styles.innerCircle}></div>
          <div className={styles.north + ' ' + styles.direction}></div>
          <div className={styles.south + ' ' + styles.direction}></div>
          <div className={styles.east + ' ' + styles.direction}></div>
          <div className={styles.west + ' ' + styles.direction}></div>
        </div>
      </button>
    </Tooltip>
  );
};

export default LocationButton;

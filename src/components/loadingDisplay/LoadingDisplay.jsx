import logo from '../../assets/LoopieLogo.png';
import styles from './loading-display.module.css';
function LoadingDisplay({ loadingFor }) {
  return (
    <div className={`${styles.container}${' '}${styles[loadingFor]}`}>
      <img className={styles.logo} src={logo} alt="Loopie Logo" />
    </div>
  );
}

export default LoadingDisplay;

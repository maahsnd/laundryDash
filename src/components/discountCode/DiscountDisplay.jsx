import styles from './discount-display.module.css';

function DiscountDisplay({ discountCode, discountMessage }) {
  if (discountCode) {
    return (
      <div className={styles.discountContainer}>
        <p>
          {discountMessage
            ? discountMessage
            : 'Save on Loopie services with discount code '}
          <span className={styles.discountCode}>{discountCode}</span>
        </p>
      </div>
    );
  }
}

export default DiscountDisplay;

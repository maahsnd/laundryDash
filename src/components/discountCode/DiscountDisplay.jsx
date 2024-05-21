import styles from './discount-display.module.css';

function DiscountDisplay({ discountCode, discountMessage }) {
  if (discountCode) {
    return (
      <div className={styles.discountContainer}>
        <a href="https://loopielaundry.com/" target="__none">
          <p>
            {discountMessage
              ? discountMessage
              : 'Save on Loopie services with discount code: '}
            <span className={styles.discountCode}>{discountCode}</span>
          </p>
        </a>
      </div>
    );
  }
}

export default DiscountDisplay;

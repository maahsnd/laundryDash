import styles from './list-view-item.module.css';

function ListViewItem({ itemData }) {
  return (
    <div className={styles.itemContainer}>
      <h4>
        <a href={itemData.googleMapsUri}>{itemData.displayName.text}</a>
      </h4>
      <p>{itemData.shortFormattedAddress}</p>
      <p>{itemData.nationalPhoneNumber}</p>
      <p>
        Rating: {itemData.rating}/5{' '}
        <span style={{ color: 'grey' }}>
          ({itemData.userRatingCount} reviews)
        </span>
      </p>
      <hr />
    </div>
  );
}

export default ListViewItem;

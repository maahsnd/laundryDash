import styles from "./list-view-item.module.css";

function ListViewItem({ itemData }) {
  return (
    <div
      className={`${styles.itemContainer} ${
        itemData.loopieService ? styles.loopie : ""
      }`}
    >
      {itemData.sponsored && (
        <span className={styles.sponsoredTag}>Sponsored</span>
      )}
      <h4>
        <a href={itemData.websiteUri || itemData.googleMapsUri} target="_blank">
          {itemData.displayName.text}
        </a>
      </h4>
      <a href={itemData.googleMapsUri} target="_blank">
        <p>{itemData.shortFormattedAddress}</p>
      </a>

      <p>{itemData.nationalPhoneNumber}</p>
      <p>
        Rating: {itemData.rating}/5{" "}
        <span style={{ color: "grey" }}>
          ({itemData.userRatingCount} reviews)
        </span>
      </p>
      {itemData.distanceFromUser && (
        <p>{itemData.distanceFromUser.toFixed(1)} miles away</p>
      )}
      <hr />
    </div>
  );
}

export default ListViewItem;

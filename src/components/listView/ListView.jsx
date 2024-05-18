import styles from './list-view.module.css';
import ListViewItem from '../listViewItem/ListViewItem';

function ListView({ laundryServices, sponsoredServices }) {
  const sortOptions = (places) => {
    byRating: () => [...places].sort((a, b) => b.rating - a.rating);
  };

  return (
    <div className={styles.listContainer}>
      {sponsoredServices.length > 0 &&
        sponsoredServices.map((service) => (
          <ListViewItem itemData={service} className={styles.sponsored} />
        ))}
      {laundryServices.length > 0 &&
        laundryServices.map((service) => <ListViewItem itemData={service} />)}
    </div>
  );
}

export default ListView;

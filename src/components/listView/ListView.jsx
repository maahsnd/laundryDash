import styles from './list-view.module.css';
import ListViewItem from '../listViewItem/ListViewItem';

function ListView({ laundryServices, sponsoredServices }) {
  return (
    <div className={styles.listContainer}>
      {sponsoredServices &&
        sponsoredServices.map((service) => (
          <ListViewItem itemData={service} className={styles.sponsored} />
        ))}
      {laundryServices &&
        laundryServices.map((service) => {
          <ListViewItem itemData={service} />;
        })}
    </div>
  );
}

export default ListView;

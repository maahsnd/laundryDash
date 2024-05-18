import styles from './list-view.module.css';
import ListViewItem from '../listViewItem/ListViewItem';
import { useState, useEffect } from 'react';

function ListView({ laundryServices, sponsoredServices }) {
  const [sortedServices, setSortedServices] = useState([]);
  const [sortOption, setSortOption] = useState('byRating');

  const sortOptions = {
    byRating: () => [...laundryServices].sort((a, b) => b.rating - a.rating)
  };

  useEffect(() => {
    const sorted = sortOptions[sortOption]();
    const services = [...sponsoredServices, ...sorted];
    setSortedServices(services);
  }, [sortOption, laundryServices, sponsoredServices]);

  return (
    <div className={styles.listContainer}>
      <div className={styles.listDash}>
        <select
          onChange={(e) => setSortOption(e.target.value)}
          value={sortOption}
        >
          <option value="byRating">Sort by Rating</option>
        </select>
      </div>

      <div className={styles.listContent}>
        {sortedServices.map((service, index) => (
          <ListViewItem key={index} itemData={service} />
        ))}
      </div>
    </div>
  );
}

export default ListView;

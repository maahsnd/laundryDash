import styles from './list-view.module.css';
import ListViewItem from '../listViewItem/ListViewItem';
import { useState, useEffect } from 'react';
import FilterSelect from '../filterSelect/FilterSelect';

function ListView({
  laundryServices,
  loopieServices,
  sponsoredServices,
  updateFilterOption
}) {
  const [sortedServices, setSortedServices] = useState([]);
  const [sortOption, setSortOption] = useState('byRating');

  const sortOptions = {
    byRating: (laundryArray) => {
      const sorted = [...laundryArray].sort((a, b) => b.rating - a.rating);
      return [...loopieServices, ...sorted];
    },
    byProximity: (laundryArray) => {
      laundryArray.sort((a, b) => {
        return a.distanceFromUser - b.distanceFromUser;
      });
      /* Place loopie services at the front. Delivery always closer than pick up! */
      return [...loopieServices, ...laundryArray];
    }
  };

  useEffect(() => {
    // Loopie services added in via sort functions
    const sorted = sortOptions[sortOption](laundryServices);
    const services = [...sponsoredServices, ...sorted];
    setSortedServices(services);
  }, [sortOption, laundryServices, sponsoredServices]);

  return (
    <div className={styles.listContainer}>
      <div className={styles.listDash}>
        <div className={styles.sortSelectContainer}>
          <label htmlFor="sortSelect">Sort by</label>
          <select
            name="sortSelect"
            onChange={(e) => setSortOption(e.target.value)}
            value={sortOption}
          >
            <option value="byRating">Highest Rated</option>
            <option value="byProximity">Closest</option>
          </select>
        </div>

        <div className={styles.filterSelectContainer}>
          <label htmlFor="filterSelect">Filter by</label>
          <FilterSelect changeHandler={updateFilterOption} />
        </div>
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

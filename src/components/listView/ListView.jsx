import styles from './list-view.module.css';
import ListViewItem from '../listViewItem/ListViewItem';
import { useState, useEffect } from 'react';
import Select from 'react-select';

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

  const filterSelectOptions = [
    { value: 'none', label: 'None' },
    { value: 'openNow', label: 'Open now' },
    { value: 'fourPlus', label: '4+ stars' },
    { value: 'fourHalfPlus', label: '4.5+ stars' }
  ];

  useEffect(() => {
    // Loopie services added in via sort functions
    const sorted = sortOptions[sortOption](laundryServices);
    const services = [...sponsoredServices, ...sorted];
    setSortedServices(services);
  }, [sortOption, laundryServices, sponsoredServices]);

  return (
    <div className={styles.listContainer}>
      <div className={styles.listDash}>
        <div>
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

        <div>
          <label htmlFor="filterSelect">Filter by</label>

          <Select
            defaultValue={[]}
            isMulti
            name="filterSelect"
            options={filterSelectOptions}
            className={styles.filterSelect}
            onChange={updateFilterOption}
          />
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

import styles from './list-view.module.css';
import ListViewItem from '../listViewItem/ListViewItem';
import { useState, useEffect } from 'react';

function ListView({
  laundryServices,
  loopieServices,
  sponsoredServices,
  position
}) {
  const [sortedServices, setSortedServices] = useState([]);
  const [sortOption, setSortOption] = useState('byRating');

  const sortOptions = {
    byRating: () =>
      [...laundryServices, ...loopieServices].sort(
        (a, b) => b.rating - a.rating
      ),
    byProximity: () => {
      const sorted = [...laundryServices].sort((a, b) => {
        const distA = calculateDistance(
          position.lat,
          position.lng,
          a.location.latitude,
          a.location.longitude
        );
        const distB = calculateDistance(
          position.lat,
          position.lng,
          b.location.latitude,
          b.location.longitude
        );
        return distA - distB;
      });
      /* Place loopie services at the front. Delivery always closer than pick up! */
      return [...loopieServices, ...sorted];
    }
  };

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3959; // Earth's radius in miles

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in miles

    return distance;
  }

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
          <option value="byProximity">Sort by Proximity</option>
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

import styles from './list-view.module.css';
import ListViewItem from '../listViewItem/ListViewItem';
import { useState, useEffect } from 'react';
import calculateDistance from '../../locationHelpers/calcDistance';

function ListView({
  laundryServices,
  loopieServices,
  sponsoredServices,
  position
}) {
  const [sortedServices, setSortedServices] = useState([]);
  const [sortOption, setSortOption] = useState('byRating');
  const [filterOption, setFilterOption] = useState('none');

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

  const filterOptions = {
    none: (laundryArray) => laundryArray,
    openNow: (laundryArray) => {
      return [...laundryArray].filter(
        (service) => service.currentOpeningHours.openNow
      );
    },
    fourPlus: (laundryArray) => {
      return [...laundryArray].filter(
        (service) => parseFloat(service.rating) >= 4
      );
    },
    fourHalfPlus: (laundryArray) => {
      return [...laundryArray].filter(
        (service) => parseFloat(service.rating) >= 4.5
      );
    }
  };

  function extractSponsoredServices(laundryArray) {
    const sponsoredServicesArr = [];
    const laundryServicesArr = [];

    laundryArray.forEach((service) => {
      if (sponsoredServices.includes(service.shortFormattedAddress)) {
        const markedService = { ...service, sponsored: 1 };
        sponsoredServicesArr.push(markedService);
      } else {
        laundryServicesArr.push(service);
      }
    });

    return [sponsoredServicesArr, laundryServicesArr];
  }

  useEffect(() => {
    const arrPlusDistanceProp = laundryServices.map((el) => {
      return {
        ...el,
        distanceFromUser: calculateDistance(
          position.lat,
          position.lng,
          el.location.latitude,
          el.location.longitude
        )
      };
    });
    const [sponsoredArr, standardArr] =
      extractSponsoredServices(arrPlusDistanceProp);
    const filtered = filterOptions[filterOption](standardArr);
    // Loopie services added in via sort functions
    const sorted = sortOptions[sortOption](filtered);
    const services = [...sponsoredArr, ...sorted];
    setSortedServices(services);
  }, [sortOption, filterOption, laundryServices, sponsoredServices]);

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
          <select
            name="filterSelect"
            onChange={(e) => setFilterOption(e.target.value)}
            value={filterOption}
          >
            <option value="none">None</option>
            <option value="openNow">Open now</option>
            <option value="fourPlus">4+ stars</option>
            <option value="fourHalfPlus">4.5+ stars</option>
          </select>
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

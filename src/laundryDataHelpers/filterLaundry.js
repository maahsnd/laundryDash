function applyFilters(laundryArray, filters) {
  return laundryArray.filter((service) => {
    return filters.every((filter) => filterOptions[filter](service));
  });
}

const filterOptions = {
  openNow: (service) => {
    return service.currentOpeningHours
      ? service.currentOpeningHours.openNow
      : false;
  },
  fourPlus: (service) => parseFloat(service.rating) >= 4,
  fourHalfPlus: (service) => parseFloat(service.rating) >= 4.5
};

export default applyFilters;

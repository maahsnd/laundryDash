export const filterOptions = {
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

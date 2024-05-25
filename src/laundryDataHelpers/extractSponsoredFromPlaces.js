export default function extractSponsoredServices(
  laundryArray,
  sponsoredServices
) {
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

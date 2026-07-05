export const SERVICE_CATEGORIES = [
  "Electrician",
  "Plumber",
  "Home Cleaning",
  "AC Repair",
  "Carpenter",
  "Painting",
  "Salon at Home",
  "Appliance Repair",
] as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

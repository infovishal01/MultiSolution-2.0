import {
  FaBolt,
  FaFaucet,
  FaBroom,
  FaSnowflake,
  FaHammer,
  FaPaintRoller,
  FaCut,
  FaTools,
} from "react-icons/fa";
import type { IconType } from "react-icons";

export interface ServiceItem {
  slug: string;
  name: string;
  tagline: string;
  icon: IconType;
  startingPrice: number;
}

export const SERVICES: ServiceItem[] = [
  {
    slug: "electrician",
    name: "Electrician",
    tagline: "Wiring, switches, fittings & repairs",
    icon: FaBolt,
    startingPrice: 199,
  },
  {
    slug: "plumber",
    name: "Plumber",
    tagline: "Leak fixes, taps, pipe fitting",
    icon: FaFaucet,
    startingPrice: 249,
  },
  {
    slug: "home-cleaning",
    name: "Home Cleaning",
    tagline: "Deep cleaning for kitchen & bathroom",
    icon: FaBroom,
    startingPrice: 499,
  },
  {
    slug: "ac-repair",
    name: "AC Repair",
    tagline: "Service, gas refill & installation",
    icon: FaSnowflake,
    startingPrice: 449,
  },
  {
    slug: "carpenter",
    name: "Carpenter",
    tagline: "Furniture repair & custom fittings",
    icon: FaHammer,
    startingPrice: 299,
  },
  {
    slug: "painting",
    name: "Painting",
    tagline: "Interior & exterior wall painting",
    icon: FaPaintRoller,
    startingPrice: 1499,
  },
  {
    slug: "salon-at-home",
    name: "Salon at Home",
    tagline: "Haircut, styling & grooming",
    icon: FaCut,
    startingPrice: 349,
  },
  {
    slug: "appliance-repair",
    name: "Appliance Repair",
    tagline: "Washing machine, fridge & more",
    icon: FaTools,
    startingPrice: 299,
  },
];

export const getServiceBySlug = (slug: string) =>
  SERVICES.find((s) => s.slug === slug);

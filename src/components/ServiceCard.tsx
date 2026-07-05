import { Link } from "react-router-dom";
import type { ServiceItem } from "../data/services";

const ServiceCard = ({ service }: { service: ServiceItem }) => {
  const Icon = service.icon;
  return (
    <Link
      id={service.slug}
      to={`/book?service=${encodeURIComponent(service.name)}`}
      className="group flex flex-col gap-4 rounded-2xl border border-black/8 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-teal)]/10 text-[var(--color-teal)] transition group-hover:bg-[var(--color-teal)] group-hover:text-white">
        <Icon size={20} />
      </span>
      <div>
        <h3 className="font-display text-lg font-bold text-ink">{service.name}</h3>
        <p className="mt-1 text-sm text-ink-soft">{service.tagline}</p>
      </div>
      <p className="mt-auto text-sm font-semibold text-[var(--color-accent-dark)]">
        Starting ₹{service.startingPrice}
      </p>
    </Link>
  );
};

export default ServiceCard;

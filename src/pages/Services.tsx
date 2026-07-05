import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ServiceCard from "../components/ServiceCard";
import { SERVICES } from "../data/services";

const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";

  const filtered = useMemo(() => {
    if (!q.trim()) return SERVICES;
    const term = q.toLowerCase();
    return SERVICES.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.tagline.toLowerCase().includes(term)
    );
  }, [q]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <h1 className="font-display text-3xl font-extrabold text-ink">All services</h1>
      <p className="mt-2 text-ink-soft">
        Browse everything we offer, or search for what you need.
      </p>

      <input
        value={q}
        onChange={(e) => setSearchParams(e.target.value ? { q: e.target.value } : {})}
        placeholder="Search services (e.g. plumber, cleaning)"
        className="mt-6 w-full max-w-md rounded-full border border-black/10 bg-white px-5 py-3 text-sm outline-none focus:border-[var(--color-teal)]"
      />

      {filtered.length === 0 ? (
        <p className="mt-10 text-ink-soft">
          No services match "{q}". Try a different search.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((s) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Services;

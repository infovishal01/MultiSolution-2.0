import { Link, useNavigate } from "react-router-dom";
import { useState, type FormEvent } from "react";
import { FaShieldAlt, FaClock, FaStar } from "react-icons/fa";
import ServiceCard from "../components/ServiceCard";
import { SERVICES } from "../data/services";

const STATS = [
  { label: "Verified professionals", value: "500+" },
  { label: "Bookings completed", value: "12,000+" },
  { label: "Cities served", value: "8" },
];

const Home = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    navigate(query ? `/services?q=${encodeURIComponent(query)}` : "/services");
  };

  return (
    <div>
      <section className="relative overflow-hidden bg-ink">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-2 md:items-center md:py-28">
          <div>
            <p className="mb-4 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-[var(--color-accent)]">
              TRUSTED HOME SERVICES
            </p>
            <h1 className="font-display text-4xl font-extrabold leading-tight text-white sm:text-5xl">
              Home repairs, sorted.
              <br />
              Book a pro in minutes.
            </h1>
            <p className="mt-5 max-w-md text-white/70">
              Electricians, plumbers, cleaners and more — background-checked
              professionals, upfront pricing, and service at your doorstep.
            </p>

            <form
              onSubmit={handleSearch}
              className="mt-8 flex max-w-md items-center gap-2 rounded-full bg-white p-1.5 shadow-lg"
            >
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What do you need help with?"
                className="flex-1 rounded-full bg-transparent px-4 py-2.5 text-sm text-ink outline-none placeholder:text-ink-soft/60"
              />
              <button
                type="submit"
                className="rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-[var(--color-accent-dark)]"
              >
                Search
              </button>
            </form>

            <div className="mt-10 flex flex-wrap gap-8">
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="font-display text-2xl font-extrabold text-white">{s.value}</p>
                  <p className="text-xs text-white/60">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {SERVICES.slice(0, 4).map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.slug}
                  to={`/book?service=${encodeURIComponent(s.name)}`}
                  className="flex flex-col gap-3 rounded-2xl bg-white/5 p-5 backdrop-blur transition hover:bg-white/10"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent)] text-ink">
                    <Icon size={16} />
                  </span>
                  <p className="font-medium text-white">{s.name}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
              Popular services near you
            </h2>
            <p className="mt-2 text-ink-soft">
              Pick a service, tell us when — a verified pro takes it from there.
            </p>
          </div>
          <Link
            to="/services"
            className="hidden text-sm font-semibold text-[var(--color-teal)] sm:block"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 sm:grid-cols-3">
          <div className="flex flex-col items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-teal)]/10 text-[var(--color-teal)]">
              <FaShieldAlt size={18} />
            </span>
            <h3 className="font-display text-lg font-bold text-ink">Background-verified</h3>
            <p className="text-sm text-ink-soft">
              Every professional is identity-checked before they're allowed to take bookings.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-teal)]/10 text-[var(--color-teal)]">
              <FaClock size={18} />
            </span>
            <h3 className="font-display text-lg font-bold text-ink">On your schedule</h3>
            <p className="text-sm text-ink-soft">
              Pick a date and time slot that works for you — we'll match a pro to it.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-teal)]/10 text-[var(--color-teal)]">
              <FaStar size={18} />
            </span>
            <h3 className="font-display text-lg font-bold text-ink">Rated by real customers</h3>
            <p className="text-sm text-ink-soft">
              Transparent ratings after every job, so quality stays high.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

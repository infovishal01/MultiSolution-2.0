import { Link } from "react-router-dom";
import { FaTools, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { SERVICES } from "../../data/services";

const Footer = () => (
  <footer className="mt-24 border-t border-black/10 bg-ink text-white/80">
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 py-14 sm:grid-cols-2 md:grid-cols-4">
      <div>
        <div className="flex items-center gap-2 font-display text-lg font-extrabold text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent)] text-ink">
            <FaTools size={14} />
          </span>
          MultiSolution
        </div>
        <p className="mt-3 max-w-xs text-sm leading-relaxed">
          Verified professionals for every home repair and service, booked in minutes.
        </p>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-semibold text-white">Popular services</h4>
        <ul className="space-y-2 text-sm">
          {SERVICES.slice(0, 5).map((s) => (
            <li key={s.slug}>
              <Link to={`/services#${s.slug}`} className="hover:text-white">
                {s.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-semibold text-white">Company</h4>
        <ul className="space-y-2 text-sm">
          <li>
            <Link to="/services" className="hover:text-white">
              All services
            </Link>
          </li>
          <li>
            <Link to="/register" className="hover:text-white">
              Join as a professional
            </Link>
          </li>
          <li>
            <Link to="/login" className="hover:text-white">
              Log in
            </Link>
          </li>
        </ul>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-semibold text-white">Get in touch</h4>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <FaPhoneAlt size={12} /> +91 90000 00000
          </li>
          <li className="flex items-center gap-2">
            <FaEnvelope size={12} /> support@multisolution.app
          </li>
        </ul>
      </div>
    </div>

    <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
      © {new Date().getFullYear()} MultiSolution. All rights reserved.
    </div>
  </footer>
);

export default Footer;

import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="mx-auto flex max-w-md flex-col items-center px-5 py-32 text-center">
    <p className="font-display text-6xl font-extrabold text-ink">404</p>
    <h1 className="mt-4 font-display text-xl font-bold text-ink">Page not found</h1>
    <p className="mt-2 text-ink-soft">
      The page you're looking for doesn't exist or has moved.
    </p>
    <Link
      to="/"
      className="mt-6 rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm font-semibold text-white"
    >
      Back to home
    </Link>
  </div>
);

export default NotFound;

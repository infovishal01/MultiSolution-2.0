import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyBookings, cancelBooking } from "../services/booking.service";
import { getErrorMessage } from "../services/api";
import type { Booking, BookingStatus } from "../types";
import Spinner from "../components/common/Spinner";

const statusStyles: Record<BookingStatus, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Assigned: "bg-blue-100 text-blue-800",
  Completed: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

const Dashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getMyBookings();
      setBookings(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Standard fetch-on-mount pattern; intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    try {
      await cancelBooking(id);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "Cancelled" } : b))
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-ink">My bookings</h1>
          <p className="mt-1 text-ink-soft">Track and manage your service requests.</p>
        </div>
        <Link
          to="/services"
          className="rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-sm font-semibold text-white"
        >
          Book a service
        </Link>
      </div>

      {loading && <Spinner label="Loading your bookings…" />}
      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      {!loading && !error && bookings.length === 0 && (
        <div className="rounded-2xl border border-dashed border-black/15 p-10 text-center text-ink-soft">
          You haven't booked anything yet.
        </div>
      )}

      <div className="flex flex-col gap-4">
        {bookings.map((b) => (
          <div
            key={b._id}
            className="flex flex-col gap-3 rounded-2xl border border-black/8 bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-display font-bold text-ink">{b.service}</p>
              <p className="text-sm text-ink-soft">{b.address}</p>
              {b.preferredDate && (
                <p className="mt-1 text-xs text-ink-soft">
                  {new Date(b.preferredDate).toLocaleDateString()} {b.preferredTime}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[b.status]}`}
              >
                {b.status}
              </span>
              {b.status === "Pending" && (
                <button
                  onClick={() => handleCancel(b._id)}
                  disabled={cancellingId === b._id}
                  className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-50"
                >
                  {cancellingId === b._id ? "Cancelling…" : "Cancel"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

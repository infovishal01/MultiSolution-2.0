import { useEffect, useState } from "react";
import { getAllBookings, updateBookingStatus } from "../../services/booking.service";
import { getErrorMessage } from "../../services/api";
import type { Booking, BookingStatus } from "../../types";
import Spinner from "../../components/common/Spinner";

const STATUS_OPTIONS: BookingStatus[] = ["Pending", "Assigned", "Completed", "Cancelled"];

const statusStyles: Record<BookingStatus, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Assigned: "bg-blue-100 text-blue-800",
  Completed: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

const AdminDashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<BookingStatus | "">("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = async (status?: BookingStatus) => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllBookings(status || undefined);
      setBookings(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Standard fetch-on-filter-change pattern; intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load(filter || undefined);
  }, [filter]);

  const handleStatusChange = async (id: string, status: BookingStatus) => {
    setUpdatingId(id);
    try {
      const updated = await updateBookingStatus(id, status);
      setBookings((prev) => prev.map((b) => (b._id === id ? updated : b)));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-ink">Admin — Bookings</h1>
          <p className="mt-1 text-ink-soft">{bookings.length} booking(s)</p>
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as BookingStatus | "")}
          className="rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[var(--color-teal)]"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {loading && <Spinner label="Loading bookings…" />}
      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-2xl border border-black/8 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/8 bg-black/[0.02] text-xs uppercase text-ink-soft">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-b border-black/5 last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">{b.fullName}</td>
                  <td className="px-4 py-3">{b.service}</td>
                  <td className="max-w-xs px-4 py-3 text-ink-soft">{b.address}</td>
                  <td className="px-4 py-3 text-ink-soft">{b.phone}</td>
                  <td className="px-4 py-3">
                    <select
                      value={b.status}
                      disabled={updatingId === b._id}
                      onChange={(e) =>
                        handleStatusChange(b._id, e.target.value as BookingStatus)
                      }
                      className={`rounded-full border-0 px-3 py-1 text-xs font-semibold outline-none ${statusStyles[b.status]}`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-ink-soft">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

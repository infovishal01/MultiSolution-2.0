import { useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { SERVICES } from "../data/services";
import { createBooking } from "../services/booking.service";
import { getErrorMessage } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import type { BookingFormData } from "../types";

const emptyForm: BookingFormData = {
  fullName: "",
  phone: "",
  email: "",
  service: "",
  address: "",
  preferredDate: "",
  preferredTime: "",
  notes: "",
};

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [form, setForm] = useState<BookingFormData>({
    ...emptyForm,
    service: searchParams.get("service") || "",
    fullName: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const update =
    (field: keyof BookingFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.fullName || !form.phone || !form.service || !form.address) {
      setError("Please fill in your name, phone, service and address.");
      return;
    }

    setSubmitting(true);
    try {
      await createBooking(form);
      setSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-5 py-24 text-center">
        <FaCheckCircle className="text-[var(--color-teal)]" size={48} />
        <h1 className="font-display text-2xl font-bold text-ink">Booking confirmed</h1>
        <p className="text-ink-soft">
          We've received your request for <strong>{form.service}</strong>. A
          professional will be assigned shortly and you'll be contacted at{" "}
          {form.phone}.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-14">
      <h1 className="font-display text-3xl font-extrabold text-ink">Book a service</h1>
      <p className="mt-2 text-ink-soft">
        Tell us what you need and when — we'll take care of the rest.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Service</label>
          <select
            value={form.service}
            onChange={update("service")}
            required
            className="w-full rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[var(--color-teal)]"
          >
            <option value="" disabled>
              Select a service
            </option>
            {SERVICES.map((s) => (
              <option key={s.slug} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Full name</label>
            <input
              value={form.fullName}
              onChange={update("fullName")}
              required
              className="w-full rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[var(--color-teal)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Phone number</label>
            <input
              value={form.phone}
              onChange={update("phone")}
              required
              type="tel"
              className="w-full rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[var(--color-teal)]"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Email (optional)</label>
          <input
            value={form.email}
            onChange={update("email")}
            type="email"
            className="w-full rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[var(--color-teal)]"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Service address</label>
          <textarea
            value={form.address}
            onChange={update("address")}
            required
            rows={3}
            className="w-full rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[var(--color-teal)]"
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Preferred date</label>
            <input
              value={form.preferredDate}
              onChange={update("preferredDate")}
              type="date"
              className="w-full rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[var(--color-teal)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Preferred time</label>
            <input
              value={form.preferredTime}
              onChange={update("preferredTime")}
              type="time"
              className="w-full rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[var(--color-teal)]"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Notes (optional)</label>
          <textarea
            value={form.notes}
            onChange={update("notes")}
            rows={2}
            placeholder="Anything the professional should know beforehand"
            className="w-full rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[var(--color-teal)]"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-60"
        >
          {submitting ? "Booking…" : "Confirm booking"}
        </button>
      </form>
    </div>
  );
};

export default BookingPage;

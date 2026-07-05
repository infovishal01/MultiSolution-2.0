const Spinner = ({ label }: { label?: string }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-soft">
    <div
      className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-teal-700"
      style={{ borderTopColor: "var(--color-teal)" }}
      role="status"
      aria-label="Loading"
    />
    {label && <p className="text-sm">{label}</p>}
  </div>
);

export default Spinner;

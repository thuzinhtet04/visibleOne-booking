import { useState, useMemo, useTransition } from "react";
import { Search } from "lucide-react";
import { useSummary } from "../hooks/useSummary";

export default function Summary() {
  const [search, setSearch] = useState("");
  const [deferredSearch, setDeferredSearch] = useState("");
  const [, startTransition] = useTransition();
  const { summary, loading, error } = useSummary();

  const filtered = useMemo(
    () =>
      deferredSearch
        ? summary.filter((item) =>
            item.userName.toLowerCase().includes(deferredSearch.toLowerCase()),
          )
        : summary,
    [summary, deferredSearch],
  );

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col">
      <div className="p-md border-b border-outline-variant">
        <div className="relative w-60">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
          />
          <input
            type="text"
            placeholder="Search by username..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              startTransition(() => setDeferredSearch(e.target.value));
            }}
            className="w-full pl-9 pr-3 py-2 text-sm bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="divide-y divide-outline-variant">
        {loading && (
          <div className="flex items-center justify-center py-12 text-on-surface-variant text-sm">
            Loading summary...
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center py-12 text-error text-sm">
            {error}
          </div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className="flex items-center justify-center py-12 text-on-surface-variant text-sm">
            {search ? "No users match your search." : "No summary data found."}
          </div>
        )}
        {!loading &&
          !error &&
          filtered.map((item) => (
            <div
              key={item.userId}
              className="flex items-center p-md hover:bg-surface-container-low/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-on-surface truncate">
                  {item.userName}
                </h4>
              </div>
              <div className="text-center shrink-0">
                <p className="font-bold text-on-surface text-lg">
                  {item.totalBookings}
                </p>
                <p className="text-[11px] text-on-surface-variant">Total</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

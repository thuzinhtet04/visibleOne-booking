import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Trash2, Plus } from "lucide-react";
import { useAuth } from "../context/authContext";
import { useBookings, useDeleteBooking } from "../hooks/useBookings";
import type { Booking, BookingStatus } from "../types/booking";

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function getStatus(booking: Booking): BookingStatus {
  const now = new Date();
  const start = new Date(booking.startTime);
  const end = new Date(booking.endTime);
  if (now >= start && now <= end) return "active";
  if (now < start) return "upcoming";
  return "completed";
}

const statusConfig: Record<
  BookingStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  active: {
    label: "Active",
    bg: "bg-secondary-container",
    text: "text-on-secondary-container",
    dot: "bg-primary",
  },
  upcoming: {
    label: "Upcoming",
    bg: "bg-primary-container",
    text: "text-on-primary-container",
    dot: "bg-secondary",
  },
  completed: {
    label: "Completed",
    bg: "bg-outline-variant/20",
    text: "text-on-surface-variant",
    dot: "bg-outline-variant",
  },
};

function canDelete(
  userId: string | undefined,
  role: string | undefined,
  booking: Booking,
) {
  if (!userId) return false;
  if (role === "admin" || role === "owner") return true;
  return userId === booking.userId;
}

function BookingRow({
  booking,
  currentUser,
  onDelete,
  deleting,
}: {
  booking: Booking;
  currentUser: { id: string; role: string } | null;
  onDelete: (id: string) => void;
  deleting: boolean;
}) {
  const status = getStatus(booking);
  const cfg = statusConfig[status];
  const showDelete = canDelete(currentUser?.id, currentUser?.role, booking);

  return (
    <div className="flex items-center p-md hover:bg-surface-container-low/50 transition-colors group">
      <div className="w-28 shrink-0">
        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
          {formatTime(booking.startTime)}
        </p>
        <p className="text-[11px] text-outline">
          {formatTime(booking.endTime)}
        </p>
      </div>
      <div className="w-8 shrink-0">
        <div className={`w-1.5 h-10 rounded-full ${cfg.dot}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-on-surface truncate">
            {booking.startTime && booking.endTime
              ? `${formatTime(booking.startTime)} - ${formatTime(booking.endTime)}`
              : "Untitled"}
          </h4>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${cfg.bg} ${cfg.text}`}
          >
            {cfg.label}
          </span>
        </div>
        <p className="text-sm text-on-surface-variant">{booking.user.name}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {showDelete && (
          <button
            onClick={() => onDelete(booking.id)}
            disabled={deleting}
            className="p-2 text-on-surface-variant hover:text-error transition-colors"
            title="Delete booking"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { bookings, loading, error, refetch } = useBookings();
  const { deleteBooking, deleting } = useDeleteBooking();
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const filteredByDate = bookings.filter((b) => {
    const start = new Date(b.startTime);
    return (
      start.getFullYear() === selectedDate.getFullYear() &&
      start.getMonth() === selectedDate.getMonth() &&
      start.getDate() === selectedDate.getDate()
    );
  });

  const activeCount = filteredByDate.filter(
    (b) => getStatus(b) === "active",
  ).length;

  const dateStr = selectedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const filtered = search
    ? filteredByDate.filter((b) =>
        b.user.name.toLowerCase().includes(search.toLowerCase()),
      )
    : filteredByDate;

  const goToPrevDay = () =>
    setSelectedDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 1);
      return d;
    });

  const goToNextDay = () =>
    setSelectedDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 1);
      return d;
    });

  const handleDelete = async (id: string) => {
    await deleteBooking(id);
    refetch();
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col">
      <div className="p-md border-b border-outline-variant flex items-center justify-between bg-surface-container-low/30">
        <div className="flex items-center gap-md">
          <div className="flex items-center gap-1">
            <button
              onClick={goToPrevDay}
              className="p-1.5 hover:bg-surface-container rounded transition-colors"
            >
              <ArrowLeft />
            </button>
            <h2 className="font-title-sm text-title-sm px-2">{dateStr}</h2>
            <button
              onClick={goToNextDay}
              className="p-1.5 hover:bg-surface-container rounded transition-colors"
            >
              <ArrowRight />
            </button>
          </div>

          <span className="text-sm font-semibold text-secondary">
            {activeCount} Active {activeCount === 1 ? "Session" : "Sessions"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="userName"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1.5 text-sm rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary w-44"
          />
          {user?.role && user.role !== "admin" && (
            <button
              onClick={() => navigate("/dashboard/create")}
              className="flex items-center gap-1 text-sm font-semibold bg-primary text-on-primary px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus size={16} />
              Create
            </button>
          )}
        </div>
      </div>

      <div className="divide-y divide-outline-variant overflow-y-auto custom-scrollbar">
        {loading && (
          <div className="flex items-center justify-center py-12 text-on-surface-variant text-sm">
            Loading bookings...
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center py-12 text-error text-sm">
            {error}
          </div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className="flex items-center justify-center py-12 text-on-surface-variant text-sm">
            No bookings found.
          </div>
        )}
        {!loading &&
          !error &&
          filtered.map((booking) => (
            <BookingRow
              key={booking.id}
              booking={booking}
              currentUser={user ? { id: user.id, role: user.role } : null}
              onDelete={handleDelete}
              deleting={deleting}
            />
          ))}
      </div>
    </div>
  );
}

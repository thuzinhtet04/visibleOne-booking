import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function toLocalDatetimeString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d}T${hh}:${mm}`;
}

function isWithinBusinessHours(date: Date): boolean {
  const h = date.getHours();
  const m = date.getMinutes();
  return h >= 9 && (h < 17 || (h === 17 && m === 0));
}

export default function CreateBooking() {
  const navigate = useNavigate();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [startError, setStartError] = useState("");
  const [endError, setEndError] = useState("");
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const getStartMin = () => {
    const now = new Date();
    const baseDate = startTime ? new Date(startTime) : new Date();
    const nineAm = new Date(baseDate);
    nineAm.setHours(9, 0, 0, 0);

    if (baseDate.toDateString() === now.toDateString()) {
      return toLocalDatetimeString(now > nineAm ? now : nineAm);
    }
    return toLocalDatetimeString(nineAm);
  };

  const getEndMax = () => {
    if (!endTime) return undefined;
    const d = new Date(endTime);
    d.setHours(17, 0, 0, 0);
    return toLocalDatetimeString(d);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStartError("");
    setEndError("");
    setApiError("");

    let hasError = false;

    if (!startTime) {
      setStartError("Start time is required.");
      hasError = true;
    }

    if (!endTime) {
      setEndError("End time is required.");
      hasError = true;
    }

    if (hasError) return;

    const start = new Date(startTime);
    console.log(start);
    const end = new Date(endTime);

    if (start >= end) {
      setEndError("End time must be after start time.");
      return;
    }

    if (!isWithinBusinessHours(start)) {
      setStartError("Must be between 9:00 AM and 5:00 PM.");
      return;
    }

    if (!isWithinBusinessHours(end)) {
      setEndError("Must be between 9:00 AM and 5:00 PM.");
      return;
    }

    if (start <= new Date()) {
      setStartError("Start time must be in the future.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/v1/booking/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          startTime: start.toISOString(),
          endTime: end.toISOString(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          setApiError(
            data.error ?? "A booking already exists for this time slot.",
          );
        } else {
          setApiError(data.error ?? "Failed to create booking.");
        }
        return;
      }

      toast.success("Booking created successfully!");
      navigate("/dashboard");
    } catch {
      setApiError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-sm">
      <div className="w-full max-w-128">
        <h1 className="font-title-lg text-title-lg mb-md">Create Booking</h1>
        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md space-y-md"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Start Time</label>
            <input
              type="datetime-local"
              value={startTime}
              min={getStartMin()}
              onChange={(e) => {
                setStartError("");
                setStartTime(e.target.value);
                if (endTime && e.target.value >= endTime) {
                  setEndTime("");
                }
              }}
              className="w-full bg-surface-container-low border border-outline-variant rounded px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
            />
            {startError && (
              <p className="text-sm text-error mt-1">{startError}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Time</label>
            <input
              type="datetime-local"
              value={endTime}
              min={startTime || getStartMin()}
              max={getEndMax()}
              onChange={(e) => {
                setEndError("");
                setEndTime(e.target.value);
              }}
              className="w-full bg-surface-container-low border border-outline-variant rounded px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
            />
            {endError && <p className="text-sm text-error mt-1">{endError}</p>}
          </div>

          {apiError && (
            <p className="text-sm text-error font-medium">{apiError}</p>
          )}

          <div className="flex items-center gap-sm pt-xs">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 dynamic-btn"
            >
              {submitting ? "Creating..." : "Create Booking"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 border border-outline-variant rounded-lg text-sm font-semibold hover:bg-surface-container transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

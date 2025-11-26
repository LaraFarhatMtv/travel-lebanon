import { bookingAPI } from "@/services/api";
import type { BookingRecord, BookingStatus } from "@/types/directus";

const COMPLETABLE_STATUSES: BookingStatus[] = ["pending", "confirmed"];

const isPastDate = (date?: string | null) => {
  if (!date) return false;
  const timestamp = new Date(date).getTime();
  if (Number.isNaN(timestamp)) return false;
  return timestamp < Date.now();
};

export const getBookingsToAutoComplete = (bookings: BookingRecord[]) =>
  bookings.filter(
    (booking) =>
      COMPLETABLE_STATUSES.includes(booking.status) && isPastDate(booking.start_date)
  );

export const autoCompletePastBookings = async (bookings: BookingRecord[]) => {
  const toComplete = getBookingsToAutoComplete(bookings);
  if (!toComplete.length) return false;

  await Promise.all(
    toComplete.map((booking) =>
      bookingAPI
        .updateBookingStatus(booking.id, "completed")
        .catch((error) => {
          console.error(`Failed to auto-complete booking ${booking.id}`, error);
        })
    )
  );

  return true;
};


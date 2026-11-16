/** Payment references use the existing order ID until the deposit is confirmed. */
export function bookingReference(booking: { id: number; status: string; bookingCode: string }): string {
  return booking.status === 'PENDING_PAYMENT' ? `#${booking.id}` : booking.bookingCode
}

/**
 * Formats a date as an ISO 8601 timestamp with an explicit UTC offset.
 *
 * @example
 * toIsoStringWithUtcOffset(new Date('2026-10-13T14:30:00.000Z'))
 * // '2026-10-13T14:30:00.000+00:00'
 */
export function toIsoStringWithUtcOffset(date: Date): string {
  return date.toISOString().replace(/Z$/, '+00:00')
}

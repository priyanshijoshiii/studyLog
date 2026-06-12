/**
 * Formats a Unix timestamp into a human-readable time string
 * based on the specified language.
 *
 * Returns time only if the timestamp is from today, or date and time
 * if it is from a previous day. Russian uses 24-hour format,
 * English uses 12-hour format with AM/PM.
 *
 * Returns an empty string if the input is invalid.
 *
 * @param ts - Unix timestamp in milliseconds
 * @param lang - Language code: 'en' for English (12h), 'ru' for Russian (24h)
 * @returns Formatted time string, or empty string for invalid input
 */
export function formatTimestamp(ts: number, lang: 'ru' | 'en'): string {
  if (typeof ts !== 'number' || isNaN(ts)) {
    return ''
  }

  const date = new Date(ts)
  if (isNaN(date.getTime())) {
    return ''
  }

  const now = new Date()

  const isToday = date.getDate() === now.getDate() &&
                  date.getMonth() === now.getMonth() &&
                  date.getFullYear() === now.getFullYear()

  const timeStr = lang === 'ru'
    ? date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    : date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })

  if (isToday) return timeStr

  const dateStr = lang === 'ru'
    ? date.toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' })
    : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return dateStr + ' · ' + timeStr
}
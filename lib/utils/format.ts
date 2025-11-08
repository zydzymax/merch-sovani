/**
 * Format price from kopeks to rubles
 */
export function formatPrice(kopeks: number): string {
  const rubles = kopeks / 100
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rubles)
}

/**
 * Format date
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

/**
 * Format datetime
 */
export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

/**
 * Generate random code (base36)
 */
export function generateCode(length: number = 10): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Generate entry code with checksum
 * Format: TTTTTTTT-RRRR-C
 * T = Timestamp (8 chars base36)
 * R = Random (4 chars base36)
 * C = Checksum (1 char)
 *
 * Capacity: 36^4 = 1,679,616 unique codes per millisecond
 * For 50k participants: extremely low collision probability
 */
export function generateEntryCode(): string {
  // Get timestamp in base36 (8 characters for better distribution)
  const timestamp = Date.now().toString(36).toUpperCase().padStart(8, '0')

  // Generate 4 random characters (36^4 = 1,679,616 combinations)
  const random = generateCode(4)

  // Calculate checksum for validation
  const checksumValue = (parseInt(timestamp, 36) + parseInt(random, 36)) % 36
  const checksum = checksumValue.toString(36).toUpperCase()

  // Format: TTTTTTTT-RRRR-C (e.g., L8X9M2QT-A5B2-K)
  return `${timestamp}-${random}-${checksum}`
}

/**
 * Validate entry code format and checksum
 * Expected format: TTTTTTTT-RRRR-C
 */
export function validateEntryCode(code: string): boolean {
  if (!code) return false

  // Check format: TTTTTTTT-RRRR-C
  const parts = code.split('-')
  if (parts.length !== 3) return false

  const [timestamp, random, checksum] = parts

  // Validate lengths
  if (timestamp.length !== 8 || random.length !== 4 || checksum.length !== 1) {
    return false
  }

  // Validate characters (base36)
  const base36Regex = /^[0-9A-Z]+$/
  if (!base36Regex.test(timestamp) || !base36Regex.test(random) || !base36Regex.test(checksum)) {
    return false
  }

  try {
    // Validate checksum
    const expectedChecksum = (parseInt(timestamp, 36) + parseInt(random, 36)) % 36
    return checksum === expectedChecksum.toString(36).toUpperCase()
  } catch {
    return false
  }
}

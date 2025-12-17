/**
 * Normalize Russian phone number to +7XXXXXXXXXX format
 * Accepts: +79..., 89..., 79..., 9...
 * Returns: +7XXXXXXXXXX or null if invalid
 */
export function normalizePhone(phone: string): string | null {
  if (!phone) return null

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '')

  // Handle different formats
  let normalized = ''

  if (digits.startsWith('8') && digits.length === 11) {
    // 89991234567 -> +79991234567
    normalized = '+7' + digits.slice(1)
  } else if (digits.startsWith('7') && digits.length === 11) {
    // 79991234567 -> +79991234567
    normalized = '+' + digits
  } else if (digits.startsWith('9') && digits.length === 10) {
    // 9991234567 -> +79991234567
    normalized = '+7' + digits
  } else if (digits.length === 11 && digits.startsWith('7')) {
    // Already in correct format
    normalized = '+' + digits
  } else {
    // Invalid format
    return null
  }

  // Validate that we have exactly 12 characters (+7 and 10 digits)
  if (normalized.length !== 12) {
    return null
  }

  return normalized
}

/**
 * Validate Russian phone number format
 */
export function isValidPhone(phone: string): boolean {
  return normalizePhone(phone) !== null
}

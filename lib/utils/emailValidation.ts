/**
 * Email validation utilities including disposable email detection
 */

// Common disposable email domains (top 100 most used)
const DISPOSABLE_DOMAINS = new Set([
  // Top disposable email providers
  'tempmail.com', 'guerrillamail.com', 'mailinator.com', 'maildrop.cc',
  '10minutemail.com', 'throwaway.email', 'temp-mail.org', 'getnada.com',
  'trashmail.com', 'yopmail.com', 'mohmal.com', 'sharklasers.com',
  'guerrillamail.info', 'grr.la', 'guerrillamail.biz', 'guerrillamail.de',
  'spam4.me', 'tmailinator.com', 'mailnesia.com', 'emailondeck.com',
  'jetable.org', 'trash-mail.com', 'spambog.com', 'boun.cr',
  'mailcatch.com', 'mytemp.email', 'dispostable.com', 'mailtemp.info',
  'tempmail.net', 'fakeinbox.com', 'tempinbox.com', 'throwawaymail.com',
  'disposablemail.com', 'anonymbox.com', 'email-fake.com', 'mintemail.com',
  'tempemail.net', 'mailforspam.com', 'deadaddress.com', 'tempmailaddress.com',
  'emailtemporanea.com', 'fakemail.net', 'mailexpire.com', 'tempsky.com',
  'emkei.cf', 'emlhub.com', 'tempmailer.com', 'tempmailo.com',
  'spambox.us', 'tempmail.us', 'spam.la', 'spaml.com',

  // Russian disposable providers
  'tempmail.ru', 'temp-mail.ru', 'mailforspam.ru', 'tempemail.ru',

  // Common typo domains and free email (optional - можно убрать если не нужно)
  // 'gmail.co', 'gmial.com', 'gmai.com' // typos of gmail
])

/**
 * Check if email domain is from a disposable email provider
 * @param email - Email address to check
 * @returns true if disposable, false otherwise
 */
export function isDisposableEmail(email: string): boolean {
  const emailLower = email.toLowerCase().trim()

  // Extract domain
  const atIndex = emailLower.lastIndexOf('@')
  if (atIndex === -1) {
    return false
  }

  const domain = emailLower.substring(atIndex + 1)

  // Check against known disposable domains
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return true
  }

  // Additional heuristics for detecting disposable patterns
  // Many disposable services use patterns like: temp-, mail-, spam-, trash-
  const disposablePatterns = [
    /^temp/,
    /^trash/,
    /^spam/,
    /^fake/,
    /^dispos/,
    /mail(inator|drop|catch|nesia)/,
    /minute.*mail/,
    /throw.*away/
  ]

  return disposablePatterns.some(pattern => pattern.test(domain))
}

/**
 * Enhanced email validation with disposable detection
 * @param email - Email address to validate
 * @param options - Validation options
 * @returns Validation result
 */
export function validateEmail(
  email: string,
  options: { allowDisposable?: boolean } = {}
): { valid: boolean; error?: string; warning?: string } {
  // Basic format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Неверный формат email адреса' }
  }

  // Check length
  if (email.length > 254) {
    return { valid: false, error: 'Email адрес слишком длинный' }
  }

  // Check for disposable email
  if (!options.allowDisposable && isDisposableEmail(email)) {
    return {
      valid: false,
      error: 'Временные email адреса не принимаются. Пожалуйста, используйте постоянный email.'
    }
  }

  // Check for common typos in popular domains
  const commonTypos: Record<string, string> = {
    'gmial.com': 'gmail.com',
    'gmai.com': 'gmail.com',
    'gmail.co': 'gmail.com',
    'yandex.ru': 'yandex.ru', // correct, just for example
    'yande.ru': 'yandex.ru',
    'mai.ru': 'mail.ru',
    'mail.r': 'mail.ru'
  }

  const domain = email.substring(email.lastIndexOf('@') + 1).toLowerCase()
  const suggestedDomain = commonTypos[domain]

  if (suggestedDomain) {
    return {
      valid: true,
      warning: `Возможно вы имели в виду: ${email.replace(domain, suggestedDomain)}?`
    }
  }

  return { valid: true }
}

/**
 * Get disposable domains count (for monitoring)
 */
export function getDisposableDomainsCount(): number {
  return DISPOSABLE_DOMAINS.size
}

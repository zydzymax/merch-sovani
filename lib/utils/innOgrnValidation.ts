/**
 * Validation utilities for Russian business identification numbers
 */

/**
 * Validate INN (Идентификационный Номер Налогоплательщика)
 * @param inn - INN string to validate
 * @returns true if valid, false otherwise
 */
export function validateINN(inn: string): { valid: boolean; error?: string } {
  // Remove spaces and dashes
  const cleanInn = inn.replace(/[\s-]/g, '')

  // Check if contains only digits
  if (!/^\d+$/.test(cleanInn)) {
    return { valid: false, error: 'ИНН должен содержать только цифры' }
  }

  // INN can be 10 digits (legal entity) or 12 digits (individual entrepreneur)
  if (cleanInn.length !== 10 && cleanInn.length !== 12) {
    return { valid: false, error: 'ИНН должен содержать 10 цифр (ЮЛ) или 12 цифр (ИП)' }
  }

  // Validate checksum for 10-digit INN
  if (cleanInn.length === 10) {
    const coefficients = [2, 4, 10, 3, 5, 9, 4, 6, 8]
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanInn[i]) * coefficients[i]
    }
    const checksum = (sum % 11) % 10
    if (checksum !== parseInt(cleanInn[9])) {
      return { valid: false, error: 'Неверная контрольная сумма ИНН' }
    }
  }

  // Validate checksum for 12-digit INN
  if (cleanInn.length === 12) {
    const coefficients1 = [7, 2, 4, 10, 3, 5, 9, 4, 6, 8]
    const coefficients2 = [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]

    let sum1 = 0
    for (let i = 0; i < 10; i++) {
      sum1 += parseInt(cleanInn[i]) * coefficients1[i]
    }
    const checksum1 = (sum1 % 11) % 10
    if (checksum1 !== parseInt(cleanInn[10])) {
      return { valid: false, error: 'Неверная контрольная сумма ИНН (1-я цифра)' }
    }

    let sum2 = 0
    for (let i = 0; i < 11; i++) {
      sum2 += parseInt(cleanInn[i]) * coefficients2[i]
    }
    const checksum2 = (sum2 % 11) % 10
    if (checksum2 !== parseInt(cleanInn[11])) {
      return { valid: false, error: 'Неверная контрольная сумма ИНН (2-я цифра)' }
    }
  }

  return { valid: true }
}

/**
 * Validate OGRN (Основной Государственный Регистрационный Номер)
 * @param ogrn - OGRN string to validate
 * @returns true if valid, false otherwise
 */
export function validateOGRN(ogrn: string): { valid: boolean; error?: string } {
  // Remove spaces and dashes
  const cleanOgrn = ogrn.replace(/[\s-]/g, '')

  // Check if contains only digits
  if (!/^\d+$/.test(cleanOgrn)) {
    return { valid: false, error: 'ОГРН должен содержать только цифры' }
  }

  // OGRN can be 13 digits (legal entity) or 15 digits (individual entrepreneur - OGRNIP)
  if (cleanOgrn.length !== 13 && cleanOgrn.length !== 15) {
    return { valid: false, error: 'ОГРН должен содержать 13 цифр (ЮЛ) или 15 цифр (ОГРНИП для ИП)' }
  }

  // Validate checksum for 13-digit OGRN
  if (cleanOgrn.length === 13) {
    const mainPart = cleanOgrn.substring(0, 12)
    const checkDigit = parseInt(cleanOgrn[12])
    const remainder = parseInt(mainPart) % 11
    const expectedCheckDigit = remainder === 10 ? 0 : remainder

    if (checkDigit !== expectedCheckDigit) {
      return { valid: false, error: 'Неверная контрольная цифра ОГРН' }
    }
  }

  // Validate checksum for 15-digit OGRNIP
  if (cleanOgrn.length === 15) {
    const mainPart = cleanOgrn.substring(0, 14)
    const checkDigit = parseInt(cleanOgrn[14])
    const remainder = parseInt(mainPart) % 13
    const expectedCheckDigit = remainder === 10 ? 0 : (remainder === 11 ? 1 : (remainder === 12 ? 2 : remainder))

    if (checkDigit !== expectedCheckDigit) {
      return { valid: false, error: 'Неверная контрольная цифра ОГРНИП' }
    }
  }

  return { valid: true }
}

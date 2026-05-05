/**
 * Caesar cipher decoder used by the bitburner "Encryption I" coding contract.
 * Shifts uppercase ASCII letters back by `key` positions; non-letters are
 * returned unchanged. Other characters (including spaces) pass through.
 */
export function caesarCipher(text: string, key: number): string {
  return text
    .split('')
    .map((char) => {
      const charCode = char.charCodeAt(0)

      if (charCode <= 90) {
        if (charCode >= 65 + key) return String.fromCharCode(charCode - key)
        if (charCode >= 65) return String.fromCharCode(charCode + 26 - key)
      }

      return char
    })
    .join('')
}

import { assertEquals } from 'https://deno.land/std/testing/asserts.ts'

function caesarCipher(text: string, key: number): string {
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

Deno.test('Caesar cipher test', () => {
  const [input, key] = ['MACRO DEBUG PRINT FRAME CACHE', 5]
  const expectedOutput = 'HVXMJ YZWPB KMDIO AMVHZ XVXCZ'
  assertEquals(caesarCipher(input, key), expectedOutput)
})

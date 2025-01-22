import { sha256 } from "@noble/hashes/sha256"

function generatePreimage() {
  const raw = new Uint8Array(20)
  crypto.getRandomValues(raw)
  const hash = sha256(sha256(raw))
  return [raw, hash]
}

export function useRandom() {
  return { generatePreimage }
}

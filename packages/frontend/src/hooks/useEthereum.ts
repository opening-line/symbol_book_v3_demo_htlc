import { useState } from "react"
import { ethers } from "ethers"
import { HTLC__factory } from "contracts"
import { getActiveAddress } from "sss-module"
import { Address } from "symbol-sdk/symbol"

async function deployHTLC(
  hash: Uint8Array,
  browserProvider: ethers.BrowserProvider,
  counterparty: string,
) {
  const factory = new HTLC__factory(await browserProvider.getSigner())
  const activeAddress = getActiveAddress()
  const contract = await factory.deploy(
    counterparty,
    BigInt(Math.floor(new Date().valueOf() / 1000 + 20 * 60)),
    hash,
    new Address(activeAddress).bytes,
    { value: 1000000000000000000n },
  )
  await contract.waitForDeployment()
}

export function useDeployHTLC() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deploy = async (
    hash: Uint8Array,
    browserProvider: ethers.BrowserProvider,
    counterparty: string,
  ) => {
    setIsLoading(true)
    setError(null)
    try {
      await deployHTLC(hash, browserProvider, counterparty)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return { deployHTLC: deploy, isLoading, error }
}

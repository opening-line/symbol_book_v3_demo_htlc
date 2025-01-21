import { useState } from "react"
import { ContractRunner, ethers } from "ethers"
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
  return await contract.waitForDeployment()
}

function decodeEventLog(hex: string) {
  const eventData = HTLC__factory.createInterface().decodeEventLog(
    "Locked",
    hex,
  )

  const fromEthAddress: string = eventData[0] // 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
  const timelock: bigint = eventData[3] // 1737433807n
  const secret: string = eventData[4] // 0x6ad7e715b656969c150f308fca302e7bd266f584c88196db13b20c70a91be5c7
  const toSymbolAddressHex = eventData[5] // 0x98cb7ddcfc9827260c6012a037ae1ad545f1a91d26505f1d
  const toSymbolAddress: Uint8Array = ethers.getBytes(toSymbolAddressHex)

  return {
    fromEthAddress,
    timelock,
    secret,
    toSymbolAddress,
  }
}

export function useDeployHTLC() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [result, setResult] = useState<string>("")

  const deploy = async (
    hash: Uint8Array,
    browserProvider: ethers.BrowserProvider,
    counterparty: string,
  ) => {
    setIsLoading(true)
    setError("")
    setResult("")
    try {
      const response = await deployHTLC(hash, browserProvider, counterparty)
      setResult(JSON.stringify(response))
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return { deployHTLC: deploy, isLoading, error, result }
}

export function useRedeemHtlc() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [result, setResult] = useState<string>("")

  const redeem = async (
    contractAddress: string,
    signer: ContractRunner,
    proof: string,
  ) => {
    setIsLoading(true)
    setError("")
    setResult("")
    try {
      const htlc = HTLC__factory.connect(contractAddress, signer)
      const response = await htlc.redeem(proof)
      setResult(JSON.stringify(response))
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return { redeemHTLC: redeem, isLoading, error, result }
}

export function useHtlc() {
  const getTopicHash = () =>
    HTLC__factory.createInterface().getEvent("Locked").topicHash

  const redeem = async (
    contractAddress: string,
    signer: ContractRunner,
    proof: string,
  ) => {
    const htlc = HTLC__factory.connect(contractAddress, signer)
    return await htlc.redeem(proof)
  }

  return {
    decodeEventLog,
    getTopicHash,
    redeem,
  }
}

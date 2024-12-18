import { useEffect, useState } from "react"

async function getBalance(address: string) {
  const response = await fetch(import.meta.env.VITE_HARDHAT_RPC_ORIGIN, {
    method: "POST",
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_getBalance",
      params: [address, "latest"],
    }),
  })
  const json = await response.json()
  const userBalance = BigInt(json.result)
  return [userBalance]
}

export default ({ address }: { address: string }) => {
  let [balance, setBalance] = useState("")
  useEffect(() => {
    if ("" == address) {
      return
    }
    const interval = setInterval(async () => {
      const [userBalance] = await getBalance(address)
      setBalance(formatBalance(userBalance))
    }, 2000)
    return () => {
      clearInterval(interval)
    }
  }, [address])
  return <>{balance}</>
}

const formatBalance = (balance: bigint) => {
  const balanceStr = balance.toString().padStart(19, "0")
  const wholeNumberPart = balanceStr.slice(0, -18)
  const fractionalPart = balanceStr.slice(-18).replace(/0*$/, "")

  return fractionalPart
    ? `${wholeNumberPart}.${fractionalPart} ETH`
    : `${wholeNumberPart} ETH`
}

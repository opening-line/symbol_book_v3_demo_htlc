import { useEffect, useState } from "react"

export default ({ address }: { address: string }) => {
  let [balance, setBalance] = useState("")
  useEffect(() => {
    if ("" == address) {
      return
    }
    const interval = setInterval(async () => {
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
      const balance = BigInt(json.result)
      setBalance(
        balance < 1000000000000000000n
          ? "0." + balance.toString().padStart(18, "0") + " ETH"
          : balance
              .toString()
              .replace(/^(.*)(.{18})/, "$1.$2")
              .replace(/0*$/, "")
              .replace(/\.$/, "") + " ETH",
      )
    }, 2000)
    return () => {
      clearInterval(interval)
    }
  }, [address])
  return <>{balance}</>
}

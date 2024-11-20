import { useEffect, useState } from "react"

export default ({ address }: { address: string }) => {
  const [balance, setBalance] = useState("")
  useEffect(() => {
    const interval = setInterval(async () => {
      const response = await fetch(
        import.meta.env.VITE_SYMBOL_API_ORIGIN + "/network/properties",
      )
      const json = await response.json()
      const mosaicId = json.chain.currencyMosaicId
        .split("0x")
        .join("")
        .split("'")
        .join("")
      try {
        const response = await fetch(
          import.meta.env.VITE_SYMBOL_API_ORIGIN +
            "/accounts?address=" +
            address,
        )
        const json = await response.json()
        let balance = 0n
        for (const mosaic of json.data[0].account.mosaics) {
          if (mosaic.id == mosaicId) {
            balance += BigInt(mosaic.amount)
          }
        }
        if (balance < 1000000n) {
          setBalance("0." + balance.toString().padStart(6, "0") + " XYM")
        } else {
          setBalance(
            balance
              .toString()
              .replace(/^(.*)(.{6})$/, "$1.$2")
              .replace(/0*$/, "")
              .replace(/\.$/, "") + " XYM",
          )
        }
      } catch (_e) {
        setBalance("")
      }
    }, 2000)
    return () => {
      clearInterval(interval)
    }
  }, [])
  return <>{balance}</>
}

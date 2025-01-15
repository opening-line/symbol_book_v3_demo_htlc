import { useEffect, useState } from "react"

async function getCurrencyMosaicId() {
  const response = await fetch(
    import.meta.env.VITE_SYMBOL_API_ORIGIN + "/network/properties",
  )
  const json = await response.json()
  const mosaicId = json.chain.currencyMosaicId
    .split("0x")
    .join("")
    .split("'")
    .join("")
  return [mosaicId]
}

async function getAccountBalance(address: string, mosaicId: string) {
  const response = await fetch(
    import.meta.env.VITE_SYMBOL_API_ORIGIN + "/accounts?address=" + address,
  )
  const json = await response.json()
  let balance = 0n
  for (const mosaic of json.data[0].account.mosaics) {
    if (mosaic.id == mosaicId) {
      balance += BigInt(mosaic.amount)
    }
  }
  return [balance]
}

export default ({ address }: { address: string }) => {
  const [balance, setBalance] = useState("")
  useEffect(() => {
    if ("" == address) {
      return
    }
    const interval = setInterval(async () => {
      const [mosaicId] = await getCurrencyMosaicId()
      const [balance] = await getAccountBalance(address, mosaicId)
      try {
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
  }, [address])
  return <>{balance}</>
}

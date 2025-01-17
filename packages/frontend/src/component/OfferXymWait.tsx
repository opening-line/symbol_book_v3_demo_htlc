import { HTLC__factory } from "contracts"
import { ethers, JsonRpcProvider } from "ethers"
import { useContext, useEffect, useState } from "react"
import { EthersBrowserProviderContext } from "../context/EthersBrowserProvider"
import { Address } from "symbol-sdk/symbol"

export default () => {
  const [browserProvider, _setBrowserProvider] = useContext(
    EthersBrowserProviderContext,
  )
  const [offer, setOffer] = useState<any[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      const remove: number[] = []
      offer.forEach((e: any, i) => {
        const timelock = HTLC__factory.createInterface().decodeEventLog(
          "Locked",
          e.data,
        )[3]
        if (timelock * 1000n < BigInt(new Date().valueOf() + 120000)) {
          remove.unshift(i)
        }
      })
      if (remove.length > 0) {
        const offer_cloned = Array.from(offer)
        remove.forEach((i) => {
          offer_cloned.splice(i, 1)
        })
        setOffer(offer_cloned)
      }
    }, 250)
    return () => {
      clearInterval(interval)
    }
  }, [offer])

  useEffect(() => {
    if (browserProvider === undefined) {
      return
    }
    const provider = new JsonRpcProvider(
      import.meta.env.VITE_HARDHAT_RPC_ORIGIN,
    )
    ;(async () => {
      provider.on(
        {
          topics: [
            HTLC__factory.createInterface().getEvent("Locked").topicHash,
            await browserProvider
              .getSigner()
              .then((r) =>
                r.address.replace("0x", "0x000000000000000000000000"),
              ),
          ],
        },
        (event) => {
          setOffer([...offer, event])
        },
      )
    })()
    return () => {
      provider.destroy()
    }
  }, [browserProvider])

  return (
    <div>
      <h2>お取引のご提案</h2>
      <div>
        {offer.length == 0
          ? "ございません"
          : offer.map((e: any, i) => {
              let event = HTLC__factory.createInterface().decodeEventLog(
                "Locked",
                e.data,
              )
              const counterpartyAddressEth = event[0]
              const counterpartyAddressXym = new Address(
                ethers.getBytes(event[5]),
              )
              return (
                <div key={i}>
                  <div>{counterpartyAddressEth}</div>
                  <div>{counterpartyAddressXym.toString()}</div>
                </div>
              )
            })}
      </div>
    </div>
  )
}

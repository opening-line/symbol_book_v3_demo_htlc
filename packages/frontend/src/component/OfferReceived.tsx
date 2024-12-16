import { HTLC__factory } from "contracts"
import { ethers, JsonRpcProvider } from "ethers"
import { createRef, useContext, useEffect, useState } from "react"
import { EthersBrowserProviderContext } from "../context/EthersBrowserProvider"
import {
  Address,
  descriptors,
  generateMosaicAliasId,
  models,
  Network,
  SymbolFacade,
} from "symbol-sdk/symbol"
import { Hash256, PublicKey } from "symbol-sdk"

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
  const onButtonClickFactory = (
    e: any,
    event: any,
    buttonRef: React.RefObject<HTMLButtonElement>,
    counterpartyAddressXym: Address,
  ) => {
    return async () => {
      const facade = new SymbolFacade(Network.TESTNET)
      const transaction = facade.createTransactionFromTypedDescriptor(
        new descriptors.SecretLockTransactionV1Descriptor(
          counterpartyAddressXym,
          new Hash256(
            Uint8Array.from(
              event[4]
                .replace("0x", "")
                .match(/../g)
                .map((s: string) => Number("0x" + s)),
            ),
          ),
          new descriptors.UnresolvedMosaicDescriptor(
            new models.UnresolvedMosaicId(generateMosaicAliasId("symbol.xym")),
            new models.Amount(1000000n),
          ),
          new models.BlockDuration(
            BigInt(
              Math.floor(
                (Number(event[3]) * 1000 - new Date().valueOf()) / 1000 / 30 -
                  1,
              ),
            ),
          ),
          models.LockHashAlgorithm.HASH_256,
        ),
        new PublicKey(
          (
            window as unknown as {
              SSS: { activePublicKey: string }
            }
          ).SSS.activePublicKey,
        ),
        100,
        60,
        0,
      )
      ;(
        window as unknown as {
          SSS: { setTransactionByPayload: (_1: string) => void }
        }
      ).SSS.setTransactionByPayload(
        Array.from<number>(transaction.serialize())
          .map((b) => b.toString(16).padStart(2, "0"))
          .join(""),
      )
      const signed = await (
        window as unknown as {
          SSS: { requestSign: () => Promise<any> }
        }
      ).SSS.requestSign()
      buttonRef.current!.disabled = true
      await fetch(import.meta.env.VITE_SYMBOL_API_ORIGIN + "/transactions", {
        method: "PUT",
        body: JSON.stringify({ payload: signed.payload }),
        headers: { "Content-Type": "application/json" },
      })
      const ws = new WebSocket(
        import.meta.env.VITE_SYMBOL_API_ORIGIN.replace(/^http/, "ws") + "/ws",
      )
      let uid: string | undefined = undefined
      const topic = "confirmedAdded/" + counterpartyAddressXym.toString()
      ws.onmessage = async (event) => {
        if (typeof event.data !== "string") {
          return
        }
        const json = JSON.parse(event.data)
        if (uid === undefined && json.uid !== undefined) {
          uid = json.uid
          ws.send(
            JSON.stringify({
              uid,
              subscribe: "block",
            }),
          )
          ws.send(
            JSON.stringify({
              uid,
              subscribe: topic,
            }),
          )
        }
        if (uid === undefined) {
          return
        }
        if (json.topic == topic) {
          console.log(json)
          const preimage = Uint8Array.from(
            json.data.transaction.proof
              .match(/../g)
              .map((s: string) => Number("0x" + s)),
          )
          const htlc = HTLC__factory.connect(
            e.address,
            await browserProvider.getSigner(),
          )
          await htlc.redeem(preimage)
          ws.close()
          window.alert("お取引が完了しました")
        }
      }
    }
  }
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
              const buttonRef = createRef<HTMLButtonElement>()
              return (
                <div key={i}>
                  <div>{counterpartyAddressEth}</div>
                  <div>{counterpartyAddressXym.toString()}</div>
                  <button
                    ref={buttonRef}
                    onClick={onButtonClickFactory(
                      e,
                      event,
                      buttonRef,
                      counterpartyAddressXym,
                    )}
                  >
                    お取引
                  </button>
                </div>
              )
            })}
      </div>
    </div>
  )
}

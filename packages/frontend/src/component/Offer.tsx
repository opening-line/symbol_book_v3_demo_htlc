import { HTLC__factory } from "contracts"
import { EthersBrowserProviderContext } from "../context/EthersBrowserProvider"
import { useContext, useEffect, useState } from "react"
import { sha256 } from "@noble/hashes/sha256"
import {
  Address,
  descriptors,
  models,
  Network,
  SymbolFacade,
} from "symbol-sdk/symbol"
import { Hash256, PublicKey } from "symbol-sdk"
import {
  getActiveAddress,
  getActivePublicKey,
  requestSign,
  setTransactionByPayload,
} from "sss-module"

export default () => {
  const [browserProvider, _setBrowserProvider] = useContext(
    EthersBrowserProviderContext,
  )
  const [offerButtonDisabled, setOfferButtonDisabled] = useState(true)
  useEffect(() => {
    setOfferButtonDisabled(undefined === browserProvider)
  }, [browserProvider])
  const [counterparty, setCounterparty] = useState("")
  const onButtonClick = async () => {
    const factory = new HTLC__factory(await browserProvider.getSigner())
    const raw = new Uint8Array(20)
    crypto.getRandomValues(raw)
    const activeAddress = getActiveAddress()
    const contract = await factory.deploy(
      counterparty,
      BigInt(Math.floor(new Date().valueOf() / 1000 + 20 * 60)),
      sha256(sha256(raw)),
      new Address(activeAddress).bytes,
      { value: 1000000000000000000n },
    )
    await contract.waitForDeployment()
    const ws = new WebSocket(
      import.meta.env.VITE_SYMBOL_API_ORIGIN.replace(/^http/, "ws") + "/ws",
    )
    let uid: string | undefined = undefined
    const topic = "confirmedAdded/" + activeAddress
    ws.onmessage = async (event) => {
      if (typeof event.data !== "string") {
        return
      }
      const json = JSON.parse(event.data)
      if (uid === undefined && json.uid !== undefined) {
        // FIXME: この時点でuidがundefinedでないことはあり得ない
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
        if (
          json.data.transaction.secret ==
            Array.from(sha256(sha256(raw))) // FIXME: インラインで処理しない
              .map((s) => s.toString(16).padStart(2, "0"))
              .join("")
              .toUpperCase() &&
          json.data.transaction.amount == "1000000"
        ) {
          const facade = new SymbolFacade(Network.TESTNET)

          const unsigned = facade.createTransactionFromTypedDescriptor(
            new descriptors.SecretProofTransactionV1Descriptor(
              new Address(activeAddress),
              new Hash256(
                // FIXME: インラインで処理しない
                Uint8Array.from(
                  json.data.transaction.secret
                    .match(/../g)
                    .map((s: string) => parseInt(s, 16)),
                ),
              ),
              models.LockHashAlgorithm.HASH_256,
              raw,
            ),
            new PublicKey(getActivePublicKey()),
            1000,
            60,
            0,
          )
          setTransactionByPayload(
            Array.from<number>(unsigned.serialize())
              .map((b) => b.toString(16).padStart(2, "0"))
              .join(""),
          )
          const signed = await requestSign()
          await fetch(
            import.meta.env.VITE_SYMBOL_API_ORIGIN + "/transactions",
            {
              method: "PUT",
              body: JSON.stringify({ payload: signed.payload }),
              headers: { "Content-Type": "application/json" },
            },
          )
          ws.close()
        }
      }
    }
  }
  return (
    <div>
      <h2
        style={{
          color: "red",
        }}
      >
        お取引を提案
      </h2>
      <div>
        <div>
          お取引先のETHのアドレス
          <input
            type='text'
            value={counterparty}
            onChange={(e) => {
              setCounterparty(e.target.value)
            }}
          />
        </div>
        <div>
          <button disabled={offerButtonDisabled} onClick={onButtonClick}>
            提案
          </button>
        </div>
      </div>
    </div>
  )
}

import { HTLC__factory } from "contracts"
import { ethers } from "ethers"
import { EthersBrowserProviderContext } from "../context/EthersBrowserProvider"
import { useContext, useState, useMemo } from "react"
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

function generatePreimage() {
  const raw = new Uint8Array(20)
  crypto.getRandomValues(raw)
  return [raw]
}

async function deployHTLC(
  raw: Uint8Array,
  browserProvider: ethers.BrowserProvider,
  counterparty: string,
) {
  const factory = new HTLC__factory(await browserProvider.getSigner())
  const activeAddress = getActiveAddress()
  const contract = await factory.deploy(
    counterparty,
    BigInt(Math.floor(new Date().valueOf() / 1000 + 20 * 60)),
    sha256(sha256(raw)),
    new Address(activeAddress).bytes,
    { value: 1000000000000000000n },
  )
  await contract.waitForDeployment()
  return [activeAddress]
}

function createSecretProofTransaction(
  raw: Uint8Array,
  activeAddress: string,
  json: any,
) {
  const facade = new SymbolFacade(Network.TESTNET)
  const digestBinary = Uint8Array.from(
    json.data.transaction.secret
      .match(/../g)
      .map((s: string) => parseInt(s, 16)),
  )
  const unsigned = facade.createTransactionFromTypedDescriptor(
    new descriptors.SecretProofTransactionV1Descriptor(
      new Address(activeAddress),
      new Hash256(digestBinary),
      models.LockHashAlgorithm.HASH_256,
      raw,
    ),
    new PublicKey(getActivePublicKey()),
    1000,
    60,
    0,
  )
  return [unsigned]
}

async function signSecretProofTransaction(unsigned: models.Transaction) {
  setTransactionByPayload(
    Array.from<number>(unsigned.serialize())
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(""),
  )
  const signed = await requestSign()
  return [signed]
}

async function announceSecretProofTransaction(signed: { payload: string }) {
  await fetch(import.meta.env.VITE_SYMBOL_API_ORIGIN + "/transactions", {
    method: "PUT",
    body: JSON.stringify({ payload: signed.payload }),
    headers: { "Content-Type": "application/json" },
  })
}

export default () => {
  const [browserProvider, _setBrowserProvider] = useContext(
    EthersBrowserProviderContext,
  )
  const [offerButtonDisabled, setOfferButtonDisabled] = useState(true)

  const [counterparty, setCounterparty] = useState("")

  const offerButtonDisabled = useMemo(() => {
    return undefined === browserProvider
  }, [browserProvider]);

  const onButtonClick = async () => {
    const [raw] = generatePreimage()
    const [activeAddress] = await deployHTLC(raw, browserProvider, counterparty)
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
      if (json.uid !== undefined) {
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
        const digestHexadecimal = Array.from(sha256(sha256(raw)))
          .map((s) => s.toString(16).padStart(2, "0"))
          .join("")
          .toUpperCase()
        if (
          json.data.transaction.secret == digestHexadecimal &&
          json.data.transaction.amount == "1000000"
        ) {
          const [unsigned] = createSecretProofTransaction(
            raw,
            activeAddress,
            json,
          )
          const [signed] = await signSecretProofTransaction(unsigned)
          await announceSecretProofTransaction(signed)
          ws.close()
        }
      }
    }
  }
  return (
    <div>
      <h2>お取引を提案</h2>
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
          <button
            type='button'
            disabled={offerButtonDisabled}
            onClick={onButtonClick}
          >
            提案
          </button>
        </div>
      </div>
    </div>
  )
}

import { useSecretProofContext } from "../context/SecretProofProvider.tsx"
import { useMemo } from "react"
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

function createSecretProofTransaction(
  proof: string,
  activeAddress: string,
  hash: string,
) {
  const facade = new SymbolFacade(Network.TESTNET)
  const unsigned = facade.createTransactionFromTypedDescriptor(
    new descriptors.SecretProofTransactionV1Descriptor(
      new Address(activeAddress),
      new Hash256(hash),
      models.LockHashAlgorithm.HASH_256,
      proof,
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
  const { secret, proof } = useSecretProofContext()

  const offerButtonDisabled = useMemo(() => {
    return proof === "" || secret === ""
  }, [proof, secret])

  const onButtonClick = async () => {
    const activeAddress = getActiveAddress()
    const [unsigned] = createSecretProofTransaction(
      proof,
      activeAddress,
      secret,
    )
    const [signed] = await signSecretProofTransaction(unsigned)
    await announceSecretProofTransaction(signed)
  }

  return (
    <div>
      <h2>お取引を受諾</h2>
      <div>
        <div>
          <button
            type='button'
            disabled={offerButtonDisabled}
            onClick={onButtonClick}
          >
            提案を受ける
          </button>
        </div>
      </div>
    </div>
  )
}

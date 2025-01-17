import {
  Address,
  descriptors,
  generateMosaicAliasId,
  models,
  Network,
  SymbolFacade,
} from "symbol-sdk/symbol"
import { Hash256, PublicKey } from "symbol-sdk"
import { setTransactionByPayload, requestSign } from "sss-module"
import { useSecretProofContext } from "../context/SecretProofProvider.tsx"
import { useEthereumContractProvider } from "../context/EthereumContractProvider.tsx"
import { useMemo } from "react"

function createSecretLockTransaction(
  secret: string,
  recipient: string,
  timeLock: number,
) {
  const facade = new SymbolFacade(Network.TESTNET)
  const transaction = facade.createTransactionFromTypedDescriptor(
    new descriptors.SecretLockTransactionV1Descriptor(
      new Address(recipient),
      new Hash256(secret),
      new descriptors.UnresolvedMosaicDescriptor(
        new models.UnresolvedMosaicId(generateMosaicAliasId("symbol.xym")),
        new models.Amount(1000000n),
      ),
      new models.BlockDuration(
        BigInt(
          Math.floor(
            (Number(timeLock) * 1000 - new Date().valueOf()) / 1000 / 30 - 1,
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
  return [transaction]
}

async function announceSecretLockTransaction(signed: { payload: string }) {
  await fetch(import.meta.env.VITE_SYMBOL_API_ORIGIN + "/transactions", {
    method: "PUT",
    body: JSON.stringify({ payload: signed.payload }),
    headers: { "Content-Type": "application/json" },
  })
}

export default () => {
  const { secret, recipient } = useSecretProofContext()
  const { timeLock } = useEthereumContractProvider()

  const buttonDisabled = useMemo(() => {
    return secret === "" || recipient === "" || timeLock === 0
  }, [secret, recipient, timeLock])

  const onButtonClick = async () => {
    const [transaction] = createSecretLockTransaction(
      secret,
      recipient,
      timeLock,
    )
    const unsignedTransactionHexadecimal = Array.from<number>(
      transaction.serialize(),
    )
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
    setTransactionByPayload(unsignedTransactionHexadecimal)
    const signed = await requestSign()
    await announceSecretLockTransaction(signed)
  }
  return (
    <div>
      <h2>お取引のご提案</h2>
      <div>
        <button type='button' onClick={onButtonClick} disabled={buttonDisabled}>
          ご提案
        </button>
      </div>
    </div>
  )
}

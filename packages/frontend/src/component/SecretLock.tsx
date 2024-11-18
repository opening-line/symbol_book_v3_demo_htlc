import { keccak256 } from "ethers"
import { useContext, useEffect, useState } from "react"
import { PayloadContext } from "../context/Payload"
import {
  Address,
  models,
  descriptors,
  Network,
  SymbolFacade,
  generateMosaicAliasId,
} from "symbol-sdk/symbol"
import { Hash256, PublicKey } from "symbol-sdk"

export default () => {
  const [payload, _setPayload] = useContext(PayloadContext)
  const [address, setAddress] = useState("")
  const [hash, setHash] = useState("")
  useEffect(() => {
    setHash(keccak256(payload).substring(2).toUpperCase())
  }, [payload])
  const [value, setValue] = useState(1000000n)
  const [height, setHeight] = useState(0n)
  if (
    typeof (window as unknown as { requestSSS: unknown }).requestSSS ===
    "function"
  ) {
    ;(window as unknown as { requestSSS: () => boolean }).requestSSS()
  }
  return (
    <div>
      <div>SecretLockTransaction</div>
      <div>
        <div>
          相手のアドレス
          <input
            type='text'
            value={address}
            onChange={(event) => {
              setAddress(event.target.value)
            }}
          />
        </div>
      </div>
      <div>
        <div>
          ハッシュ
          <input
            type='text'
            value={hash}
            onChange={(event) => {
              setHash(event.target.value)
            }}
          />
        </div>
      </div>
      <div>
        <div>
          ロックする期間（ブロック）
          <input
            type='text'
            value={height.toString()}
            onChange={(event) => {
              setHeight(BigInt(event.target.value))
            }}
          />
        </div>
      </div>
      <div>
        <div>
          数量
          <input
            type='text'
            value={value.toString()}
            onChange={(event) => {
              setValue(BigInt(event.target.value))
            }}
          />
        </div>
      </div>
      <button
        onClick={(_event) => {
          const facade = new SymbolFacade(Network.TESTNET)
          const unsigned = facade.transactionFactory.create(
            new descriptors.SecretLockTransactionV1Descriptor(
              new Address(address),
              new Hash256(hash),
              new descriptors.UnresolvedMosaicDescriptor(
                new models.UnresolvedMosaicId(
                  generateMosaicAliasId("symbol.xym"),
                ),
                new models.Amount(value),
              ),
              new models.BlockDuration(height),
              models.LockHashAlgorithm.SHA3_256,
            ).toMap(),
          )
          unsigned.signerPublicKey = new models.PublicKey(
            new PublicKey(
              (window as unknown as { SSS: { activePublicKey: string } }).SSS
                .activePublicKey,
            ).bytes,
          )
          unsigned.fee = new models.Amount(BigInt(unsigned.size) * 100n)
          unsigned.deadline = new models.Timestamp(
            facade.now().addSeconds(45).timestamp,
          )
          ;(
            window as unknown as {
              SSS: { setTransactionByPayload: (_0: string) => void }
            }
          ).SSS.setTransactionByPayload(
            Array.from(unsigned.serialize())
              .map((b) => b.toString(16).padStart(2, "0"))
              .join(""),
          )
          ;(
            window as unknown as {
              SSS: { requestSign: () => Promise<{ payload: string }> }
            }
          ).SSS.requestSign()
            .then((r) => r.payload)
            .then((r) => {
              fetch(import.meta.env.VITE_SYMBOL_API_ORIGIN + "/transactions", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ payload: r }),
              })
            })
        }}
      >
        アナウンス
      </button>
    </div>
  )
}

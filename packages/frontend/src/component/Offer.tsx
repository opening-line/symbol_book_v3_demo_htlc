import { HTLC__factory } from "contracts"
import { EthersBrowserProviderContext } from "../context/EthersBrowserProvider"
import { useContext, useEffect, useState } from "react"
import { PayloadContext } from "../context/Payload"
import { keccak256 } from "ethers"
import { Address } from "symbol-sdk/symbol"

export default () => {
  const [browserProvider, _setBrowserProvider] = useContext(
    EthersBrowserProviderContext,
  )
  const [_payload, setPayload] = useContext(PayloadContext)
  const [offerButtonDisabled, setOfferButtonDisabled] = useState(true)
  useEffect(() => {
    setOfferButtonDisabled(undefined === browserProvider)
  }, [browserProvider])
  const [counterparty, setCounterparty] = useState("")
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
            disabled={offerButtonDisabled}
            onClick={async () => {
              const factory = new HTLC__factory(
                await browserProvider.getSigner(),
              )
              const raw = new Uint8Array(1024)
              crypto.getRandomValues(raw)
              const contract = await factory.deploy(
                counterparty,
                BigInt(Math.floor(new Date().valueOf() / 1000 + 20 * 60)),
                keccak256(raw),
                new Address(
                  (window as unknown as { SSS: { activeAddress: string } }).SSS
                    .activeAddress,
                ).bytes,
                { value: 1000000000000000000n },
              )
              await contract.waitForDeployment()
              setPayload(raw)
            }}
          >
            提案
          </button>
        </div>
      </div>
    </div>
  )
}

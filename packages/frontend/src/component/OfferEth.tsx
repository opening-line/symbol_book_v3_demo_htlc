import { HTLC__factory } from "contracts"
import { ethers } from "ethers"
import { EthersBrowserProviderContext } from "../context/EthersBrowserProvider"
import { useContext, useState, useMemo } from "react"
import { sha256 } from "@noble/hashes/sha256"
import { Address } from "symbol-sdk/symbol"
import { utils } from "symbol-sdk"
import { getActiveAddress } from "sss-module"
import { useSecretProofContext } from "../context/SecretProofProvider.tsx"

function generatePreimage() {
  const raw = new Uint8Array(20)
  crypto.getRandomValues(raw)
  return [raw]
}

async function deployHTLC(
  hash: Uint8Array,
  browserProvider: ethers.BrowserProvider,
  counterparty: string,
) {
  const factory = new HTLC__factory(await browserProvider.getSigner())
  const activeAddress = getActiveAddress()
  const contract = await factory.deploy(
    counterparty,
    BigInt(Math.floor(new Date().valueOf() / 1000 + 20 * 60)),
    hash,
    new Address(activeAddress).bytes,
    { value: 1000000000000000000n },
  )
  await contract.waitForDeployment()
}

export default () => {
  const [browserProvider, _setBrowserProvider] = useContext(
    EthersBrowserProviderContext,
  )
  const { setProof, setSecret } = useSecretProofContext()

  const [counterparty, setCounterparty] = useState("")

  const offerButtonDisabled = useMemo(() => {
    return undefined === browserProvider
  }, [browserProvider])

  const onButtonClick = async () => {
    const [proof] = generatePreimage()
    const secret = sha256(sha256(proof))
    setProof(utils.uint8ToHex(proof))
    setSecret(utils.uint8ToHex(secret))
    await deployHTLC(secret, browserProvider, counterparty)
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

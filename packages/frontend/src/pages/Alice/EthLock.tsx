import React, { useState, useMemo } from "react"
import { utils } from "symbol-sdk"
import { useSecretEthersBrowserProviderProvider } from "../../context/EthersBrowserProvider"
import { useSecretProofContext } from "../../context/SecretProofProvider.tsx"
import { useRandom } from "../../hooks/useRandom.ts"
import { useDeployHTLC } from "../../hooks/useEthereum.ts"
import { Link } from "react-router-dom"

export const AliceEthLock: React.FC = () => {
  const { browserProvider } = useSecretEthersBrowserProviderProvider()
  const { proof, secret, setProof, setSecret } = useSecretProofContext()
  const { generatePreimage } = useRandom()
  const {
    isLoading: isDeploying,
    deployHTLC,
    error: deployError,
  } = useDeployHTLC()

  const [counterparty, setCounterparty] = useState("")

  const offerButtonDisabled = useMemo(() => {
    return undefined === browserProvider || counterparty === "" || isDeploying
  }, [browserProvider, counterparty, isDeploying])

  const isDeployFinished = useMemo(() => {
    return proof !== "" && secret !== "" && deployError === null && !isDeploying
  }, [proof, secret, deployError, isDeploying])

  const onButtonClick = async () => {
    if (!browserProvider) {
      window.alert("BrowserProviderが無いです")
      return
    }

    const [proof, secret] = generatePreimage()
    setProof(utils.uint8ToHex(proof))
    setSecret(utils.uint8ToHex(secret))
    await deployHTLC(secret, browserProvider, counterparty)
  }

  return (
    <>
      <h1>
        アリス <small>ETHのロック</small>
      </h1>
      <div className='grid'>
        <div>
          <h2>お取引を提案</h2>
          <div>
            <div>
              お取引先のETHのアドレス
              <input
                type='text'
                name='address'
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
                {isDeploying ? "ご提案中..." : "ご提案"}
              </button>
            </div>
          </div>
          <div
            style={{
              marginTop: 10,
              wordBreak: "break-all",
              fontFamily: "monospace",
            }}
          >
            {deployError}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 10 }}>
        {isDeployFinished && (
          <Link
            className='button'
            style={{ marginRight: ".4rem" }}
            to='/alice/xymlockwait'
          >
            次へ
          </Link>
        )}
        {!isDeployFinished && (
          <button type='button' disabled={true}>
            次へ
          </button>
        )}
      </div>
    </>
  )
}

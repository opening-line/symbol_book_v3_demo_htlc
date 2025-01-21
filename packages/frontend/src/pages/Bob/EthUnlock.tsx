import React, { useMemo, useState } from "react"
import { useSecretEthersBrowserProviderProvider } from "../../context/EthersBrowserProvider.tsx"
import { useSecretProofContext } from "../../context/SecretProofProvider.tsx"
import { useEthereumContractProvider } from "../../context/EthereumContractProvider.tsx"
import { useHtlc } from "../../hooks/useEthereum.ts"
import {Link} from "react-router-dom";

export const BobEthUnlock: React.FC = () => {
  const [result, setResult] = useState<string>("")

  const { browserProvider } = useSecretEthersBrowserProviderProvider()
  const { proof } = useSecretProofContext()
  const { contractAddress } = useEthereumContractProvider()
  const { redeem } = useHtlc()

  const buttonDisabled = useMemo(() => {
    return (
      proof === "" || contractAddress === "" || browserProvider === undefined
    )
  }, [proof, contractAddress, browserProvider])

  const onButtonClick = async () => {
    if (!browserProvider) {
      window.alert("BrowserProviderが無いです")
      return
    }

    const response = await redeem(
      contractAddress,
      await browserProvider.getSigner(),
      `0x${proof}`,
    )

    setResult(JSON.stringify(response))
  }

  const nextButtonDisabled = useMemo(() => {
    return result === ""
  }, [proof])

  return (
    <>
      <h1>
        Bob <small>アリスのETHのロックを解除</small>
      </h1>
      <div className='grid'>
        <div>
          <h2>お取引のご提案</h2>
          <div>
            <button
              type='button'
              onClick={onButtonClick}
              disabled={buttonDisabled}
            >
              お取引
            </button>
          </div>
          <h3>結果</h3>
          {result && (
            <div
              style={{
                marginTop: 10,
                wordBreak: "break-all",
                fontFamily: "monospace",
              }}
            >
              アナウンスの結果： {result}
            </div>
          )}
        </div>
      </div>
      <div>
        {nextButtonDisabled && (
          <button type='button' disabled={true}>
            次へ
          </button>
        )}
        {!nextButtonDisabled && (
          <Link className='button' to='/bob/finish'>
            次へ
          </Link>
        )}
      </div>
    </>
  )
}

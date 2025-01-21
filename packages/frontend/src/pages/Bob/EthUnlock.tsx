import React, { useMemo } from "react"
import { useSecretEthersBrowserProviderProvider } from "../../context/EthersBrowserProvider.tsx"
import { useSecretProofContext } from "../../context/SecretProofProvider.tsx"
import { useEthereumContractProvider } from "../../context/EthereumContractProvider.tsx"
import { useRedeemHtlc } from "../../hooks/useEthereum.ts"
import { Link } from "react-router-dom"

export const BobEthUnlock: React.FC = () => {
  const { browserProvider } = useSecretEthersBrowserProviderProvider()
  const { proof } = useSecretProofContext()
  const { contractAddress } = useEthereumContractProvider()
  const { redeemHTLC, isLoading, result, error } = useRedeemHtlc()

  const buttonDisabled = useMemo(() => {
    return (
      proof === "" ||
      contractAddress === "" ||
      browserProvider === undefined ||
      isLoading
    )
  }, [proof, contractAddress, browserProvider, isLoading])

  const onButtonClick = async () => {
    if (!browserProvider) {
      window.alert("BrowserProviderが無いです")
      return
    }

    await redeemHTLC(
      contractAddress,
      await browserProvider.getSigner(),
      `0x${proof}`,
    )
  }

  const nextButtonDisabled = useMemo(() => {
    return result === "" || error !== "" || isLoading
  }, [proof, error, isLoading])

  return (
    <>
      <h1>
        Bob <small>アリスのETHのロックを解除</small>
      </h1>
      <div className='grid'>
        <div>
          <h2>お取引のご提案</h2>
          <h3>情報</h3>
          <div
            style={{
              marginTop: 10,
              wordBreak: "break-all",
              fontFamily: "monospace",
            }}
          >
            プルーフ： {proof}
          </div>
          <div style={{ marginTop: 10 }}>
            <button
              type='button'
              onClick={onButtonClick}
              disabled={buttonDisabled}
            >
              {isLoading ? "お取引中..." : "お取引"}
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
          {error && (
            <div
              style={{
                marginTop: 10,
                wordBreak: "break-all",
                fontFamily: "monospace",
              }}
            >
              エラー： {error}
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

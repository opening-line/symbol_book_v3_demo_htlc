import React, { useMemo, useState } from "react"
import { getActiveAddress } from "sss-module"
import { useSecretProofContext } from "../../context/SecretProofProvider.tsx"
import { useSecretProofTransaction } from "../../hooks/useSymbol.ts"
import { Link } from "react-router-dom"

export const AliceXymUnlock: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [result, setResult] = useState<string>("")
  const [txHash, setTxHash] = useState<string>("")

  const { secret, proof } = useSecretProofContext()
  const {
    createSecretProofTransaction,
    signSecretProofTransaction,
    announceSecretProofTransaction,
  } = useSecretProofTransaction()

  const offerButtonDisabled = useMemo(() => {
    return proof === "" || secret === "" || isLoading
  }, [proof, secret, isLoading])

  const nextButtonDisabled = useMemo(() => {
    return txHash !== ""
  }, [txHash])

  const onOfferButtonClick = async () => {
    setIsLoading(true)
    try {
      const activeAddress = getActiveAddress()
      const [unsigned] = createSecretProofTransaction(
        proof,
        activeAddress,
        secret,
      )
      const [signed] = await signSecretProofTransaction(unsigned)
      setTxHash(signed.hash)
      const announceResult = await announceSecretProofTransaction(signed).then(
        (res) => res.json(),
      )
      setResult(JSON.stringify(announceResult))
    } catch (e) {
      setError(JSON.stringify(e))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <h1>
        アリス <small>ボブのXYMロックを解除</small>
      </h1>
      <div className='grid'>
        <div>
          <h2>お取引を受諾</h2>
          <h3>情報</h3>
          <div
            style={{
              marginTop: 10,
              wordBreak: "break-all",
              fontFamily: "monospace",
            }}
          >
            シークレット： {secret}
          </div>
          <div
            style={{
              marginTop: 10,
              wordBreak: "break-all",
              fontFamily: "monospace",
            }}
          >
            プルーフ： {proof}
          </div>
          <div style={{ marginTop: 20 }}>
            <div>
              <button
                type='button'
                disabled={offerButtonDisabled}
                onClick={onOfferButtonClick}
              >
                {isLoading ? "解除中..." : "解除する"}
              </button>
            </div>
          </div>
          <h3>結果</h3>
          {txHash && (
            <div
              style={{
                marginTop: 10,
                wordBreak: "break-all",
                fontFamily: "monospace",
              }}
            >
              トランザクションハッシュ： {txHash}
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
          <Link className='button' to='/alice/finish'>
            次へ
          </Link>
        )}
      </div>
    </>
  )
}

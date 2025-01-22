import React, { useMemo, useState } from "react"
import { useSecretProofContext } from "../../context/SecretProofProvider.tsx"
import { useEthereumContractProvider } from "../../context/EthereumContractProvider.tsx"
import { useSecretLockTransaction } from "../../hooks/useSymbol.ts"
import { Link } from "react-router-dom"

export const BobXymLock: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [result, setResult] = useState<string>("")
  const [txHash, setTxHash] = useState<string>("")

  const { secret, recipient } = useSecretProofContext()
  const { timeLock } = useEthereumContractProvider()
  const {
    createSecretLockTransaction,
    signSecretLockTransaction,
    announceSecretLockTransaction,
  } = useSecretLockTransaction()

  const buttonDisabled = useMemo(() => {
    return secret === "" || recipient === "" || timeLock === 0 || isLoading
  }, [secret, recipient, timeLock])

  const nextButtonDisabled = useMemo(() => {
    return txHash === ""
  }, [txHash])

  const onButtonClick = async () => {
    try {
      const [unsigned] = createSecretLockTransaction(
        secret,
        recipient,
        timeLock,
      )
      const [signed] = await signSecretLockTransaction(unsigned)
      setTxHash(signed.hash)
      const announceResult = await announceSecretLockTransaction(signed).then(
        (res) => res.json(),
      )
      setResult(JSON.stringify(announceResult))
    } catch (e) {
      console.error(e)
      setError(JSON.stringify(e))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <h1>
        Bob <small>XYMをロック</small>
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
            シークレット： {secret}
          </div>
          <div
            style={{
              marginTop: 10,
              wordBreak: "break-all",
              fontFamily: "monospace",
            }}
          >
            アリスのアドレス： {recipient}
          </div>
          <div
            style={{
              marginTop: 10,
              wordBreak: "break-all",
              fontFamily: "monospace",
            }}
          >
            期限： {new Date(timeLock * 1000).toLocaleString()} (unixtime:{" "}
            {timeLock})
          </div>
          <div style={{ marginTop: 10 }}>
            <button
              type='button'
              onClick={onButtonClick}
              disabled={buttonDisabled}
            >
              {isLoading ? "ご提案中..." : "ご提案"}
            </button>
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
          <Link className='button' to='/bob/xymunlockwait'>
            次へ
          </Link>
        )}
      </div>
    </>
  )
}

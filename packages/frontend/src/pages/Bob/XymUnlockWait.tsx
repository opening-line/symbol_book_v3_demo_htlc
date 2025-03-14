import React, { useEffect, useMemo } from "react"
import { useSecretProofContext } from "../../context/SecretProofProvider.tsx"
import { Link } from "react-router-dom"
import { sha256 } from '@noble/hashes/sha256'
import { hexToBytes } from '@noble/hashes/utils'

export const BobXymUnlockWait: React.FC = () => {
  const { recipient, setProof, proof, secret } = useSecretProofContext()

  // Uint8Array同士を比較する関数
  const compareBytes = (a: Uint8Array, b: Uint8Array): boolean => {
    if (a.length !== b.length) return false
    return a.every((val, i) => val === b[i])
  }

  // 文字列をUint8Arrayに変換する関数
  const stringToBytes = (input: string): Uint8Array => {
    // 入力が16進数文字列かどうかをチェック（簡易的な判定）
    const isHex = /^[0-9a-fA-F]*$/.test(input)
    
    if (isHex) {
      // 16進数文字列の場合、Uint8Arrayに変換
      return hexToBytes(input)
    } else {
      // 通常の文字列の場合、エンコードしてUint8Arrayに変換
      return new TextEncoder().encode(input)
    }
  }

  // Double SHA-256を計算する関数（Uint8Arrayを返す）
  const doubleSha256 = (input: string): Uint8Array => {
    // 入力をUint8Arrayに変換
    const inputBytes = stringToBytes(input)
    
    // 1回目のSHA-256
    const firstHash = sha256(inputBytes)
    // 2回目のSHA-256
    return sha256(firstHash)
  }

  // proofがsecretの原像であるかをチェックする関数
  const isValidProof = (proofToCheck: string): boolean => {
    if (!proofToCheck || !secret) return false
    
    // proofにdouble SHA-256を適用
    const hashedProofBytes = doubleSha256(proofToCheck)
    
    // secretをUint8Arrayに変換
    const secretBytes = stringToBytes(secret)
    
    // Uint8Array同士を比較
    return compareBytes(hashedProofBytes, secretBytes)
  }

  // proofを設定する前に検証を行う関数
  const validateAndSetProof = (proofToCheck: string): boolean => {
    if (isValidProof(proofToCheck)) {
      setProof(proofToCheck)
      return true
    } else {
      console.error("無効なproof（secretの原像ではありません）:", proofToCheck)
      return false
    }
  }

  useEffect(() => {
    if (recipient === "") {
      return
    }

    const ws = new WebSocket(
      import.meta.env.VITE_SYMBOL_API_ORIGIN.replace(/^http/, "ws") + "/ws",
    )
    let uid: string | undefined = undefined
    const topic = "confirmedAdded/" + recipient
    ws.onmessage = async (event) => {
      if (typeof event.data !== "string") {
        return
      }
      const eventData = JSON.parse(event.data)
      if (uid === undefined && eventData.uid !== undefined) {
        uid = eventData.uid
        ws.send(
          JSON.stringify({
            uid,
            subscribe: "block",
          }),
        )
        ws.send(
          JSON.stringify({
            uid,
            subscribe: topic,
          }),
        )
      }
      if (uid === undefined) {
        return
      }
      if (eventData.topic == topic) {
        console.log(eventData)
        if (eventData.data.transaction.type === 16978) {
          const proof = eventData.data.transaction.proof
          // proofが有効かチェックしてから設定
          const isValid = validateAndSetProof(proof)
          // 有効なプルーフが見つかった場合のみWebSocket接続を閉じる
          if (isValid) {
            ws.close()
          }
        }
      }
    }
    fetch(
      `${import.meta.env.VITE_SYMBOL_API_ORIGIN}/transactions/confirmed?pageSize=100&order=desc&address=${recipient}`,
    )
      .then((res) => res.json())
      .then((json) => json.data)
      .then((data: any[]) => data.filter((d) => d.transaction.type === 16978))
      .then((a) => {
        if (a.length > 0) {
          // proofが有効かチェックしてから設定
          const isValid = validateAndSetProof(a[0].transaction.proof)
          // 有効なプルーフが見つかった場合のみWebSocket接続を閉じる
          if (isValid) {
            ws.close()
          }
        }
      })
    return () => {
      ws.close()
    }
  }, [recipient, secret])

  const nextButtonDisabled = useMemo(() => {
    return proof === ""
  }, [proof])

  return (
    <>
      <h1>
        Bob <small>アリスのXYMロック解除待ち</small>
      </h1>
      <div className='grid'>
        <div>
          <h2>ご提案の状況</h2>
          {!proof && <div>待ち</div>}
          {proof && (
            <>
              <div>確認済み</div>
              <div>プルーフ: {proof}</div>
            </>
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
          <Link className='button' to='/bob/ethunlock'>
            次へ
          </Link>
        )}
      </div>
    </>
  )
}

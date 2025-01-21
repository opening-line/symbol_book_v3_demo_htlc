import React, { useEffect, useMemo } from "react"
import { useSecretProofContext } from "../../context/SecretProofProvider.tsx"
import { Link } from "react-router-dom"

export const BobXymUnlockWait: React.FC = () => {
  const { recipient, setProof, proof } = useSecretProofContext()

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
      const json = JSON.parse(event.data)
      if (uid === undefined && json.uid !== undefined) {
        uid = json.uid
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
      if (json.topic == topic) {
        console.log(json)
        const proof = json.data.transaction.proof
        setProof(proof)
      }
    }

    return () => {
      ws.close()
    }
  }, [recipient])

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
          <Link className='button' to='/bob/xymlock'>
            次へ
          </Link>
        )}
      </div>
    </>
  )
}

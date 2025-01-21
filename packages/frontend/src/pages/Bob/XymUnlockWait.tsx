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
          setProof(proof)
        }
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

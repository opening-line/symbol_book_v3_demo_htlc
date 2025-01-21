import React, {useState} from "react"
import { useEffect } from "react"
import { getActiveAddress } from "sss-module"
import { useSecretProofContext } from "../../context/SecretProofProvider.tsx"

export const AliceXymLockWait: React.FC = () => {
  const [txHash, setTxHash] = useState<string>("")

  const activeAddress = getActiveAddress()
  const { secret } = useSecretProofContext()

  useEffect(() => {
    const url = import.meta.env.VITE_SYMBOL_API_ORIGIN
    const ws = new WebSocket(url.replace(/^http/, "ws") + "/ws")
    let uid: string | undefined = undefined
    const topic = "confirmedAdded/" + activeAddress
    ws.onmessage = async (event) => {
      if (typeof event.data !== "string") {
        return
      }
      const eventData = JSON.parse(event.data)
      if (eventData.uid !== undefined) {
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
        if (
          eventData.data.transaction.secret == secret &&
          eventData.data.transaction.amount == "1000000"
        ) {
          setTxHash(eventData.data.meta.hash)
          ws.close()
        }
      }
    }

    return () => {
      ws.close()
    }
  }, [])

  return (
    <>
      <h1>
        アリス <small>ボブのXYMロック待機</small>
      </h1>
      <div className='grid'>
        <div>
          <h2>ボブのXYMロック</h2>
          <p>{txHash}</p>
        </div>
      </div>
    </>
  )
}

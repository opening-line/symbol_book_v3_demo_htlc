import { useEffect } from "react"
import { useSecretProofContext } from "../context/SecretProofProvider.tsx"

export default () => {
  const { recipient, setProof } = useSecretProofContext()

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

  return (
    <div>
      <h2>お取引のご提案</h2>
      <div></div>
    </div>
  )
}

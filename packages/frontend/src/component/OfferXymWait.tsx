import { useEffect } from "react"
import { getActiveAddress } from "sss-module"
import { useSecretProofContext } from "../context/SecretProofProvider.tsx"

export default () => {
  const activeAddress = getActiveAddress()
  const { secret } = useSecretProofContext()

  useEffect(() => {
    const ws = new WebSocket(
      import.meta.env.VITE_SYMBOL_API_ORIGIN.replace(/^http/, "ws") + "/ws",
    )
    let uid: string | undefined = undefined
    const topic = "confirmedAdded/" + activeAddress
    ws.onmessage = async (event) => {
      if (typeof event.data !== "string") {
        return
      }
      const json = JSON.parse(event.data)
      if (json.uid !== undefined) {
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
        if (
          json.data.transaction.secret == secret &&
          json.data.transaction.amount == "1000000"
        ) {
          ws.close()
        }
      }
    }
  }, [])

  return (
    <div>
      <h2>お取引のご提案</h2>
    </div>
  )
}

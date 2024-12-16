import { useState } from "react"
import XymBalance from "./XymBalance"

export default () => {
  const [address, setAddress] = useState("")
  const onButtonClick = () => {
    const sssIsAllowed = (
      window as unknown as { isAllowedSSS: () => boolean }
    ).isAllowedSSS()
    if (sssIsAllowed) {
      setAddress(
        (window as unknown as { SSS: { activeAddress: string } }).SSS
          .activeAddress,
      )
      return
    }
    ;(window as unknown as { requestSSS: () => boolean }).requestSSS()
  }
  return (
    <div>
      <h2
	  style={{
		color: "red",
	  }}
	  >SSS Extension</h2>
      <div>
        <button onClick={onButtonClick}>SSSと接続</button>
        {address}(<XymBalance address={address} />)
      </div>
    </div>
  )
}

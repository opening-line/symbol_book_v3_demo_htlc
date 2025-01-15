import { useState } from "react"
import XymBalance from "./XymBalance"
import { getActiveAddress, isAllowedSSS } from "sss-module"

export default () => {
  const [address, setAddress] = useState("")
  const onButtonClick = () => {
    const sssIsAllowed = isAllowedSSS()
    if (sssIsAllowed) {
      setAddress(getActiveAddress())
      return
    }
  }
  return (
    <div>
      <h2>SSS Extension</h2>
      <div>
        <button type='button' onClick={onButtonClick}>
          SSSと接続
        </button>
        {address}(<XymBalance address={address} />)
      </div>
    </div>
  )
}

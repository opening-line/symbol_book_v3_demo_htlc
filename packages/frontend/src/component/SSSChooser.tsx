import React from "react"
import XymBalance from "./XymBalance"
import { getActiveAddress, isAllowedSSS } from "sss-module"

type Props = {
  symbolAddress: string
  setSymbolAddress: (address: string) => void
}

const SSSChooser: React.FC<Props> = ({ symbolAddress, setSymbolAddress }) => {
  const onButtonClick = () => {
    const sssIsAllowed = isAllowedSSS()
    if (sssIsAllowed) {
      setSymbolAddress(getActiveAddress())
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
      </div>
      <div style={{ marginTop: 10 }}>
        <div>{symbolAddress}</div>
        <div>
          <XymBalance address={symbolAddress} />
        </div>
      </div>
    </div>
  )
}

export default SSSChooser

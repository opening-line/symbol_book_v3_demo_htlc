import React, { useState } from "react"
import EIP6963Chooser from "../../component/EIP6963Chooser.tsx"
import SSSChooser from "../../component/SSSChooser.tsx"

export const AliceSetUp: React.FC = () => {
  const [ethAddress, setEthAddress] = useState<string>("")
  const [symbolAddress, setSymbolAddress] = useState<string>("")

  return (
    <>
      <h1>
        アリス <small>セットアップ</small>
      </h1>
      <div className='grid'>
        <div>
          <EIP6963Chooser
            ethAddress={ethAddress}
            setEthAddress={setEthAddress}
          />
        </div>
        <div>
          <SSSChooser
            symbolAddress={symbolAddress}
            setSymbolAddress={setSymbolAddress}
          />
        </div>
      </div>
    </>
  )
}

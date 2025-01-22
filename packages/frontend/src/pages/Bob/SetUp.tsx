import React, { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import EIP6963Chooser from "../../component/EIP6963Chooser.tsx"
import SSSChooser from "../../component/SSSChooser.tsx"

export const BobSetUp: React.FC = () => {
  const navigate = useNavigate()
  const [ethAddress, setEthAddress] = useState<string>("")
  const [symbolAddress, setSymbolAddress] = useState<string>("")

  const buttonDisabled = useMemo(() => {
    return ethAddress === "" || symbolAddress === ""
  }, [ethAddress, symbolAddress])

  const buttonClick = () => {
    navigate("/bob/ethlockwait")
  }

  return (
    <>
      <h1>
        Bob <small>セットアップ</small>
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
      <div>
        <button type='button' onClick={buttonClick} disabled={buttonDisabled}>
          次へ
        </button>
      </div>
    </>
  )
}

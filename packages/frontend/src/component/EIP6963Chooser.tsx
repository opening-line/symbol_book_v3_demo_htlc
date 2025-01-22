import React, { useState, useMemo } from "react"
import { useEIP6963DetailProvider } from "../context/EIP6963Detail"
import { useSecretEthersBrowserProviderProvider } from "../context/EthersBrowserProvider"
import { BrowserProvider } from "ethers"
import EthBalance from "./EthBalance"

type Props = {
  ethAddress: string
  setEthAddress: (address: string) => void
}

const EIP6963Chooser: React.FC<Props> = ({ ethAddress, setEthAddress }) => {
  const { details } = useEIP6963DetailProvider()
  const { setBrowserProvider } = useSecretEthersBrowserProviderProvider()
  const [provider, setProvider] = useState<any>(undefined)

  const onButtonClick = async () => {
    const newBrowserProvider = new BrowserProvider(provider, 31337)
    setEthAddress(await (await newBrowserProvider.getSigner()).getAddress())
    setBrowserProvider(newBrowserProvider)
  }

  const buttonDisabled = useMemo(() => {
    return details.length === 0
  }, [])

  return (
    <div>
      <h2>EIP-6963対応ウォレット</h2>
      <div>
        {details.length === 0 && <p>ウォレット検知できず</p>}
        {details.length > 0 &&
          details.map((d, i) => (
            <label key={i}>
              <input
                type='radio'
                name='eip6963'
                value={i}
                onChange={(_event) => {
                  setProvider(d.provider)
                }}
              />
              {d.info.name}
            </label>
          ))}
      </div>
      <div style={{ marginTop: 10 }}>
        <button type='button' onClick={onButtonClick} disabled={buttonDisabled}>
          接続
        </button>
      </div>
      <div style={{ marginTop: 10 }}>
        <div>{ethAddress}</div>
        <div>
          <EthBalance address={ethAddress} />
        </div>
      </div>
    </div>
  )
}

export default EIP6963Chooser

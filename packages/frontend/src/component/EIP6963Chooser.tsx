import React, { useState, useMemo } from "react"
import { useEIP6963DetailProvider } from "../context/EIP6963Detail"
import { useSecretEthersBrowserProviderProvider } from "../context/EthersBrowserProvider"
import { BrowserProvider } from "ethers"
import EthBalance from "./EthBalance"

export default () => {
  const { details } = useEIP6963DetailProvider()
  const { setBrowserProvider } = useSecretEthersBrowserProviderProvider()
  const [provider, setProvider] = useState<any>(undefined)
  const [address, setAddress] = useState("")
  const onButtonClick = async (_event: React.MouseEvent<HTMLButtonElement>) => {
    const newBrowserProvider = new BrowserProvider(provider, 31337)
    setAddress(await (await newBrowserProvider.getSigner()).getAddress())
    setBrowserProvider(newBrowserProvider)
  }
  return (
    <div>
      <h2>EIP-6963対応ウォレット</h2>
      {details.map((d, i) => (
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
      <div>
        <button type='button' onClick={onButtonClick}>
          接続
        </button>
        {address}(<EthBalance address={address} />)
      </div>
    </div>
  )
}

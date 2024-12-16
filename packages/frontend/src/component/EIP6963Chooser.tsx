import { useContext, useState } from "react"
import { EIP6963DetailContext } from "../context/EIP6963Detail"
import { EthersBrowserProviderContext } from "../context/EthersBrowserProvider"
import { BrowserProvider } from "ethers"
import EthBalance from "./EthBalance"

export default () => {
  const detail = useContext(EIP6963DetailContext)
  const [_browserProvider, setBrowserProvider] = useContext(
    EthersBrowserProviderContext,
  )
  const [provider, setProvider] = useState<any>(undefined)
  const [address, setAddress] = useState("")
  const onButtonClick = async (_event: React.MouseEvent<HTMLButtonElement>) => {
    const newBrowserProvider = new BrowserProvider(provider, 31337)
    setAddress(await (await newBrowserProvider.getSigner()).getAddress())
    setBrowserProvider(newBrowserProvider)
  }
  return (
    <div>
      <h2
		style={{
			color: "red",
		}}
	  >EIP-6963対応ウォレット</h2>
      {detail.map((d, i) => (
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
        <button onClick={onButtonClick}>接続</button>
        {address}(<EthBalance address={address} />)
      </div>
    </div>
  )
}

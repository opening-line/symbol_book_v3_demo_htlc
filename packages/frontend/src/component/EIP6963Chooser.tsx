import { useContext, useState } from "react"
import { EIP6963DetailContext } from "../context/EIP6963Detail"
import { EthersBrowserProviderContext } from "../context/EthersBrowserProvider"
import { BrowserProvider } from "ethers"

export default () => {
  const detail = useContext(EIP6963DetailContext)
  const [browserProvider, setBrowserProvider] = useContext(
    EthersBrowserProviderContext,
  )
  const [address, setAddress] = useState("")
  return (
    <div>
      <h2>EIP-6963対応ウォレット</h2>
      {detail.map((d, i) => (
        <label key={i}>
          <input
            type='radio'
            name='eip6963'
            value={i}
            onChange={(_event) => {
              setBrowserProvider(new BrowserProvider(d.provider))
            }}
          />
          {d.info.name}
        </label>
      ))}
      <div>
        <button
          onClick={async (_event) => {
            setAddress(await (await browserProvider.getSigner()).getAddress())
          }}
        >
          接続
        </button>
        {address}
      </div>
    </div>
  )
}

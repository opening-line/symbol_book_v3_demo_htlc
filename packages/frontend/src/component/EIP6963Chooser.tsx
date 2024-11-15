import { useContext } from "react"
import { EIP6963DetailContext } from "../context/EIP6963Detail"
import { EthersBrowserProviderContext } from "../context/EthersBrowserProvider"
import { BrowserProvider } from "ethers"

export default () => {
  const detail = useContext(EIP6963DetailContext)
  const [_browserProvider, setBrowserProvider] = useContext(
    EthersBrowserProviderContext,
  )
  return (
    <>
      <div>EIP-6963対応ウォレット</div>
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
    </>
  )
}

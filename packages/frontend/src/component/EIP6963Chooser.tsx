import { useContext } from "react"
import { EIP6963DetailContext } from "../context/EIP6963Detail"

export default () => {
  const detail = useContext(EIP6963DetailContext)
  return (
    <>
      <div>EIP-6963対応ウォレット</div>
      {detail.map((d, i) => (
        <label>
          <input
            type='radio'
            name='eip6963'
            value={i}
            onChange={(_event) => {}}
          />
          {d.info.name}
        </label>
      ))}
    </>
  )
}

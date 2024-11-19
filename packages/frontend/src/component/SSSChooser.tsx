import { useState } from "react"

export default () => {
  const [address, setAddress] = useState("")
  return (
    <div>
      <h2>SSS Extension</h2>
      <div>
        <button
          onClick={() => {
            const sssIsAllowed = (
              window as unknown as { isAllowedSSS: () => boolean }
            ).isAllowedSSS()
            if (sssIsAllowed) {
              setAddress(
                (window as unknown as { SSS: { activeAddress: string } }).SSS
                  .activeAddress,
              )
              return
            }
            ;(window as unknown as { requestSSS: () => boolean }).requestSSS()
          }}
        >
          SSSと接続
        </button>
        {address}
      </div>
    </div>
  )
}

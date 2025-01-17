import React from "react"
import UnlockXym from "../../component/UnlockXym.tsx"

export const AliceXymUnlock: React.FC = () => {
  return (
    <>
      <h1>
        アリス <small>ボブのXYMロックを解除</small>
      </h1>
      <div className='grid'>
        <div>
          <UnlockXym />
        </div>
      </div>
    </>
  )
}

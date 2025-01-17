import React from "react"
import UnlockXymWait from "../../component/UnlockXymWait.tsx"

export const BobXymUnlockWait: React.FC = () => {
  return (
    <>
      <h1>Bob</h1>
      <div className='grid'>
        <div>
          <UnlockXymWait />
        </div>
      </div>
    </>
  )
}

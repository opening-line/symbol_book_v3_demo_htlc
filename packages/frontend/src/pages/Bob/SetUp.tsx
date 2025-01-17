import React from "react"
import EIP6963Chooser from "../../component/EIP6963Chooser.tsx"
import SSSChooser from "../../component/SSSChooser.tsx"

export const BobSetUp: React.FC = () => {
  return (
    <>
      <h1>Bob</h1>
      <div className='grid'>
        <div>
          <EIP6963Chooser />
        </div>
        <div>
          <SSSChooser />
        </div>
      </div>
    </>
  )
}

import React from "react"
import EIP6963Chooser from "../../component/EIP6963Chooser.tsx"
import SSSChooser from "../../component/SSSChooser.tsx"

export const AliceSetUp: React.FC = () => {
  return (
    <>
      <h1>
        アリス <small>セットアップ</small>
      </h1>
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

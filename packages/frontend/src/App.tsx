import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { EIP6963DetailProvider } from "./context/EIP6963Detail"
import { EthersBrowserProviderProvider } from "./context/EthersBrowserProvider"
import Layout from "./component/Layout"
import { Home } from "./pages"
import { AliceIndex } from "./pages/Alice/Home.tsx"
import { AliceSetUp } from "./pages/Alice/SetUp.tsx"
import { AliceEthLock } from "./pages/Alice/EthLock.tsx"
import { AliceXymLockWait } from "./pages/Alice/XymLockWait.tsx"
import { AliceXymUnlock } from "./pages/Alice/XymUnlock.tsx"
import { AliceFinish } from "./pages/Alice/Finish.tsx"
import { BobIndex } from "./pages/Bob/Home.tsx"
import { BobSetUp } from "./pages/Bob/SetUp.tsx"
import { BobEthUnlock } from "./pages/Bob/EthUnlock.tsx"
import { BobEthLockWait } from "./pages/Bob/EthLockWait.tsx"
import { BobXymLock } from "./pages/Bob/XymLock.tsx"
import { BobXymUnlockWait } from "./pages/Bob/XymUnlockWait.tsx"
import { BobFinish } from "./pages/Bob/Finish.tsx"
import AliceLayout from "./component/AliceLayout.tsx"
import BobLayout from "./component/BobLayout.tsx"
import { SecretProofProvider } from "./context/SecretProofProvider.tsx"
import { EthereumContractProvider } from "./context/EthereumContractProvider.tsx"

export default function () {
  return (
    <EthersBrowserProviderProvider>
      <EIP6963DetailProvider>
        <SecretProofProvider>
          <EthereumContractProvider>
            <Router>
              <Routes>
                <Route path='/alice' element={<AliceLayout />}>
                  <Route path='' element={<AliceIndex />} />
                  <Route path='setup' element={<AliceSetUp />} />
                  <Route path='ethlock' element={<AliceEthLock />} />
                  <Route path='xymlockwait' element={<AliceXymLockWait />} />
                  <Route path='xymunlock' element={<AliceXymUnlock />} />
                  <Route path='finish' element={<AliceFinish />} />
                </Route>
                <Route path='/bob' element={<BobLayout />}>
                  <Route path='' element={<BobIndex />} />
                  <Route path='setup' element={<BobSetUp />} />
                  <Route path='ethlockwait' element={<BobEthLockWait />} />
                  <Route path='xymlock' element={<BobXymLock />} />
                  <Route path='xymunlockwait' element={<BobXymUnlockWait />} />
                  <Route path='ethunlock' element={<BobEthUnlock />} />
                  <Route path='finish' element={<BobFinish />} />
                </Route>
                <Route path='/' element={<Layout />}>
                  <Route path='' element={<Home />} />
                </Route>
              </Routes>
            </Router>
          </EthereumContractProvider>
        </SecretProofProvider>
      </EIP6963DetailProvider>
    </EthersBrowserProviderProvider>
  )
}

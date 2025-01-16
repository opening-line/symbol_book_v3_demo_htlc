import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { EIP6963DetailProvider } from "./context/EIP6963Detail"
import { EthersBrowserProviderProvider } from "./context/EthersBrowserProvider"
import Layout from "./component/Layout"
import { Home } from "./pages"
import { AliceIndex } from "./pages/Alice"
import { BobIndex } from "./pages/Bob"
import AliceLayout from "./component/AliceLayout.tsx";
import BobLayout from "./component/BobLayout.tsx";

export default function () {
  return (
    <EthersBrowserProviderProvider>
      <EIP6963DetailProvider>
        <Router>
          <Routes>
            <Route path='/alice' element={<AliceLayout />}>
              <Route path='' element={<AliceIndex />} />
            </Route>
            <Route path='/bob' element={<BobLayout />}>
              <Route path='' element={<BobIndex />} />
            </Route>
            <Route path='/' element={<Layout />}>
              <Route path='' element={<Home />} />
            </Route>
          </Routes>
        </Router>
      </EIP6963DetailProvider>
    </EthersBrowserProviderProvider>
  )
}

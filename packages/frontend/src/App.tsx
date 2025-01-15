import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { EIP6963DetailProvider } from "./context/EIP6963Detail"
import { EthersBrowserProviderProvider } from "./context/EthersBrowserProvider"
import Layout from "./component/Layout"
import { Home } from "./pages"
import { AliceIndex } from "./pages/Alice"
import { BobIndex } from "./pages/Bob"

export default function () {
  return (
    <EthersBrowserProviderProvider>
      <EIP6963DetailProvider>
        <Router>
          <Routes>
            <Route path='/' element={<Layout />}>
              <Route path='/' element={<Home />} />
              <Route path='/alice' element={<AliceIndex />} />
              <Route path='/bob' element={<BobIndex />} />
            </Route>
          </Routes>
        </Router>
      </EIP6963DetailProvider>
    </EthersBrowserProviderProvider>
  )
}

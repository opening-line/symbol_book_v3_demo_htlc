import { Eip1193Provider } from "ethers"
import { createContext, FC, PropsWithChildren } from "react"

export interface EIP6963Detail {
  info: { name: string; uuid: string; icon: string; rdns: string }
  provider: Eip1193Provider
}

export const EIP6963DetailContext = createContext([] as EIP6963Detail[])

export const EIP6963DetailProvider: FC<PropsWithChildren> = ({ children }) => {
  const detail = [] as EIP6963Detail[]
  window.addEventListener("eip6963:announceProvider", (event) => {
    detail.push((event as unknown as { detail: EIP6963Detail }).detail)
  })
  window.dispatchEvent(new Event("eip6963:requestProvider"))
  return (
    <EIP6963DetailContext.Provider value={detail}>
      {children}
    </EIP6963DetailContext.Provider>
  )
}

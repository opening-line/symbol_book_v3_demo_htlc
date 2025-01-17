import { Eip1193Provider } from "ethers"
import { createContext, FC, PropsWithChildren, useContext } from "react"

export interface EIP6963Detail {
  info: { name: string; uuid: string; icon: string; rdns: string }
  provider: Eip1193Provider
}

interface EIP6963DetailContext {
  details: EIP6963Detail[]
}

const EIP6963DetailContext = createContext<EIP6963DetailContext>({
  details: [],
})

export const EIP6963DetailProvider: FC<PropsWithChildren> = ({ children }) => {
  const detail = [] as EIP6963Detail[]

  window.addEventListener("eip6963:announceProvider", (event) => {
    detail.push((event as unknown as { detail: EIP6963Detail }).detail)
  })

  window.dispatchEvent(new Event("eip6963:requestProvider"))

  const value = { details: detail }

  return (
    <EIP6963DetailContext.Provider value={value}>
      {children}
    </EIP6963DetailContext.Provider>
  )
}

export const useEIP6963DetailProvider = () => {
  const context = useContext(EIP6963DetailContext)

  if (!context) {
    throw new Error(
      "useEIP6963DetailProvider must be used within an EIP6963DetailProvider",
    )
  }

  return context
}

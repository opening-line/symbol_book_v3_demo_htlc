import { BrowserProvider } from "ethers"
import {} from "ethers"
import { createContext, FC, PropsWithChildren, useState } from "react"

export const EthersBrowserProviderContext = createContext<
  [BrowserProvider, React.Dispatch<React.SetStateAction<BrowserProvider>>]
>(undefined!)

export const EthersBrowserProviderProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const value = useState<BrowserProvider>(undefined!)
  return (
    <EthersBrowserProviderContext.Provider value={value}>
      {children}
    </EthersBrowserProviderContext.Provider>
  )
}

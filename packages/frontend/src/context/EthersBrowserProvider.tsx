import { BrowserProvider } from "ethers"
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from "react"

interface EthersBrowserProviderType {
  browserProvider: BrowserProvider | undefined
  setBrowserProvider: (provider: BrowserProvider) => void
}

const EthersBrowserProviderContext = createContext<
  EthersBrowserProviderType | undefined
>(undefined)

export const EthersBrowserProviderProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [browserProvider, setBrowserProvider] = useState<
    BrowserProvider | undefined
  >(undefined)

  const value = { browserProvider, setBrowserProvider }

  return (
    <EthersBrowserProviderContext.Provider value={value}>
      {children}
    </EthersBrowserProviderContext.Provider>
  )
}

export const useSecretEthersBrowserProviderProvider =
  (): EthersBrowserProviderType => {
    const context = useContext(EthersBrowserProviderContext)
    if (!context) {
      throw new Error(
        "useEthersBrowserProviderProvider must be used within the EthersBrowserProviderProvider",
      )
    }
    return context
  }

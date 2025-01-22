import React, { createContext, useContext, useState, ReactNode } from "react"

interface AppContextType {
  timeLock: number
  setTimeLock: (timeLock: number) => void
  contractAddress: string
  setContractAddress: (contractAddress: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const EthereumContractProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [timeLock, setTimeLock] = useState(0)
  const [contractAddress, setContractAddress] = useState("")

  const value = { timeLock, setTimeLock, contractAddress, setContractAddress }

  return <AppContext.Provider value={value}> {children} </AppContext.Provider>
}

export const useEthereumContractProvider = (): AppContextType => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error(
      "useEthereumContractProvider must be used within the EthereumContractProvider",
    )
  }
  return context
}

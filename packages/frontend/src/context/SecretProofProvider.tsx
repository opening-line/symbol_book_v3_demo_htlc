import React, { createContext, useContext, useState, ReactNode } from "react"

interface AppContextType {
  secret: string
  proof: string
  setSecret: (secret: string) => void
  setProof: (proof: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const SecretProofProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [secret, setSecret] = useState("")
  const [proof, setProof] = useState("")

  const value = { secret, proof, setSecret, setProof }

  return <AppContext.Provider value={value}> {children} </AppContext.Provider>
}

export const useSecretProofContext = (): AppContextType => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error(
      "useSecretProofContext must be used within the SecretProofProvider",
    )
  }
  return context
}

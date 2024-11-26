import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useState,
} from "react"

export const PayloadContext = createContext<
  [Uint8Array, Dispatch<SetStateAction<Uint8Array>>]
>(undefined!)

export const PayloadProvider: FC<PropsWithChildren> = ({ children }) => {
  const value = useState<Uint8Array>(new Uint8Array())
  return (
    <PayloadContext.Provider value={value}>{children}</PayloadContext.Provider>
  )
}

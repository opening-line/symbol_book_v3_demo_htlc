/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_HARDHAT_RPC_ORIGIN: string
  readonly VITE_SYMBOL_API_ORIGIN: string
  // その他の環境変数...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

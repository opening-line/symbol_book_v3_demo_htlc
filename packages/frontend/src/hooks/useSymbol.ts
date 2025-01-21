import {
  Address,
  descriptors,
  models,
  Network,
  SymbolFacade,
} from "symbol-sdk/symbol"
import { Hash256, PublicKey } from "symbol-sdk"
import {
  getActivePublicKey,
  requestSign,
  setTransactionByPayload,
} from "sss-module"

function createSecretProofTransaction(
  proof: string,
  activeAddress: string,
  hash: string,
) {
  const facade = new SymbolFacade(Network.TESTNET)
  const unsigned = facade.createTransactionFromTypedDescriptor(
    new descriptors.SecretProofTransactionV1Descriptor(
      new Address(activeAddress),
      new Hash256(hash),
      models.LockHashAlgorithm.HASH_256,
      proof,
    ),
    new PublicKey(getActivePublicKey()),
    1000,
    60,
    0,
  )
  return [unsigned]
}

async function signSecretProofTransaction(unsigned: models.Transaction) {
  setTransactionByPayload(
    Array.from<number>(unsigned.serialize())
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(""),
  )
  const signed = await requestSign()
  return [signed]
}

async function announceSecretProofTransaction(signed: { payload: string }) {
  return await fetch(import.meta.env.VITE_SYMBOL_API_ORIGIN + "/transactions", {
    method: "PUT",
    body: JSON.stringify({ payload: signed.payload }),
    headers: { "Content-Type": "application/json" },
  })
}

export function useSecretProofTransaction() {
  return {
    createSecretProofTransaction,
    signSecretProofTransaction,
    announceSecretProofTransaction,
  }
}

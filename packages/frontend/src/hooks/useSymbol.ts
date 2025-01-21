import {
  Address,
  descriptors,
  generateMosaicAliasId,
  models,
  Network,
  SymbolFacade,
} from "symbol-sdk/symbol"
import { Hash256, PublicKey, utils } from "symbol-sdk"
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
      utils.hexToUint8(proof),
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

function createSecretLockTransaction(
  secret: string,
  recipient: string,
  timeLock: number,
) {
  const facade = new SymbolFacade(Network.TESTNET)
  const transaction = facade.createTransactionFromTypedDescriptor(
    new descriptors.SecretLockTransactionV1Descriptor(
      new Address(recipient),
      new Hash256(secret),
      new descriptors.UnresolvedMosaicDescriptor(
        new models.UnresolvedMosaicId(generateMosaicAliasId("symbol.xym")),
        new models.Amount(1000000n),
      ),
      new models.BlockDuration(
        BigInt(
          Math.floor(
            (Number(timeLock) * 1000 - new Date().valueOf()) / 1000 / 30 - 1,
          ),
        ),
      ),
      models.LockHashAlgorithm.HASH_256,
    ),
    new PublicKey(
      (
        window as unknown as {
          SSS: { activePublicKey: string }
        }
      ).SSS.activePublicKey,
    ),
    100,
    60,
    0,
  )
  return [transaction]
}

async function signSecretLockTransaction(unsigned: models.Transaction) {
  setTransactionByPayload(
    Array.from<number>(unsigned.serialize())
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(""),
  )
  const signed = await requestSign()
  return [signed]
}

async function announceSecretLockTransaction(signed: { payload: string }) {
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

export function useSecretLockTransaction() {
  return {
    createSecretLockTransaction,
    signSecretLockTransaction,
    announceSecretLockTransaction,
  }
}

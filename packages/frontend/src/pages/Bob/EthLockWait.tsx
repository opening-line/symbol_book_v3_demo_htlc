import React, { useEffect, useMemo, useState } from "react"
import { JsonRpcProvider } from "ethers"
import { useSecretEthersBrowserProviderProvider } from "../../context/EthersBrowserProvider"
import { Address } from "symbol-sdk/symbol"
import { useSecretProofContext } from "../../context/SecretProofProvider.tsx"
import { useEthereumContractProvider } from "../../context/EthereumContractProvider.tsx"
import { useHtlc } from "../../hooks/useEthereum.ts"
import { Link } from "react-router-dom"

interface EventLog {
  contractAddress: string
  fromEthAddress: string
  timelock: bigint
  secret: string
  toSymbolAddress: Uint8Array
}

export const BobEthLockWait: React.FC = () => {
  const { browserProvider } = useSecretEthersBrowserProviderProvider()
  const { secret, setSecret, setRecipient } = useSecretProofContext()
  const { setTimeLock, setContractAddress } = useEthereumContractProvider()
  const { decodeEventLog, getTopicHash } = useHtlc()

  const [eventLogData, setEventLogData] = useState<EventLog[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      const remove: number[] = []
      eventLogData.forEach(({ timelock }, index) => {
        if (timelock * 1000n < BigInt(new Date().valueOf() + 120000)) {
          remove.unshift(index)
        }
      })
      if (remove.length > 0) {
        setEventLogData((oldVal) => {
          remove.forEach((i) => {
            oldVal.splice(i, 1)
          })
          return oldVal
        })
      }
    }, 250)

    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    if (browserProvider === undefined) {
      return
    }

    const provider = new JsonRpcProvider(
      import.meta.env.VITE_HARDHAT_RPC_ORIGIN,
    )
    ;(async () => {
      provider.on(
        {
          topics: [
            getTopicHash(),
            await browserProvider
              .getSigner()
              .then((signer) =>
                signer.address.replace("0x", "0x000000000000000000000000"),
              ),
          ],
        },
        (event) => {
          const decoded = decodeEventLog(event.data)
          const add: EventLog = {
            contractAddress: event.address,
            ...decoded,
          }
          setEventLogData((oldVal) => [...oldVal, add])
        },
      )
    })()

    return () => {
      provider.destroy()
    }
  }, [browserProvider])

  const onButtonClick = (
    contractAddress: string,
    secret: string,
    timelock: bigint,
    counterpartyAddressXym: Address,
  ) => {
    setSecret(secret.replace("0x", "").toUpperCase())
    setTimeLock(Number(timelock))
    setRecipient(counterpartyAddressXym.toString())
    setContractAddress(contractAddress)
  }

  const nextButtonDisabled = useMemo(() => {
    return secret === ""
  }, [secret])

  return (
    <>
      <h1>
        Bob <small>アリスのETHロックを待機</small>
      </h1>
      <div className='grid'>
        <div>
          <h2>お取引のご提案</h2>
          <div>
            {eventLogData.length == 0
              ? "ございません"
              : eventLogData.map(
                  (
                    {
                      contractAddress,
                      fromEthAddress,
                      secret,
                      timelock,
                      toSymbolAddress,
                    },
                    index,
                  ) => {
                    const counterpartyAddressEth = fromEthAddress
                    const counterpartyAddressXym = new Address(toSymbolAddress)
                    return (
                      <div key={index} style={{ marginTop: 20 }}>
                        <div
                          style={{
                            marginTop: 10,
                            wordBreak: "break-all",
                            fontFamily: "monospace",
                          }}
                        >
                          アリスのETHアドレス： {counterpartyAddressEth}
                        </div>
                        <div
                          style={{
                            marginTop: 10,
                            wordBreak: "break-all",
                            fontFamily: "monospace",
                          }}
                        >
                          アリスのSymbolアドレス：
                          {counterpartyAddressXym.toString()}
                        </div>
                        <div style={{ marginTop: 10 }}>
                          <button
                            type='button'
                            onClick={() =>
                              onButtonClick(
                                contractAddress,
                                secret,
                                timelock,
                                counterpartyAddressXym,
                              )
                            }
                          >
                            お取引を選択
                          </button>
                        </div>
                      </div>
                    )
                  },
                )}
          </div>
        </div>
      </div>
      <div>
        {nextButtonDisabled && (
          <button type='button' disabled={true}>
            次へ
          </button>
        )}
        {!nextButtonDisabled && (
          <Link className='button' to='/bob/xymlock'>
            次へ
          </Link>
        )}
      </div>
    </>
  )
}

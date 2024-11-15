import { HTLC__factory } from "contracts"
import { useContext, useEffect, useState } from "react"
import { EthersBrowserProviderContext } from "../context/EthersBrowserProvider"
import { PayloadContext } from "../context/Payload"
import { keccak256 } from "ethers"

export default () => {
  const [ethersBrowserProvider, _setEthersBrowserProvider] = useContext(
    EthersBrowserProviderContext,
  )
  const [payload, _setPayload] = useContext(PayloadContext)
  const [address, setAddress] = useState("")
  const [hash, setHash] = useState("")
  useEffect(() => {
    setHash(keccak256(payload))
  }, [payload])
  const [time, setTime] = useState(0)
  const [value, setValue] = useState(1000000000000000000n)
  return (
    <>
      <div>HTLCをデプロイ</div>
      <div>
        <div>
          相手のアドレス
          <input
            type='text'
            value={address}
            onChange={(event) => {
              setAddress(event.target.value)
            }}
          />
        </div>
        <div>
          ハッシュ
          <input
            type='text'
            value={hash}
            onChange={(event) => {
              setHash(event.target.value)
            }}
          />
        </div>
        <div>
          ロックする期間
          <input
            type='number'
            value={time}
            onChange={(event) => {
              setTime(Number(event.target.value))
            }}
          />
        </div>
        <div>
          数量{"(wei)"}
          <input
            type='number'
            value={value.toString()}
            onChange={(event) => {
              setValue(BigInt(event.target.value))
            }}
          />
        </div>
        <div>
          <button
            onClick={async (_event) => {
              const factory = new HTLC__factory(
                await ethersBrowserProvider.getSigner(),
              )
              const htlc = await factory.deploy(address, BigInt(time), hash)
              await htlc.waitForDeployment()
              console.log(await htlc.getAddress())
            }}
          >
            デプロイ
          </button>
        </div>
      </div>
    </>
  )
}

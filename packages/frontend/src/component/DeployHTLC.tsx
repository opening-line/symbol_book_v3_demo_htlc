import { HTLC__factory } from "contracts"
import { useContext, useState } from "react"
import { EthersBrowserProviderContext } from "../context/EthersBrowserProvider"

export default () => {
  const [ethersBrowserProvider, _setEthersBrowserProvider] = useContext(
    EthersBrowserProviderContext,
  )
  const [address, setAddress] = useState("")
  const [hash, _setHash] = useState("")
  const [time, setTime] = useState(0)
  return (
    <>
      <div>HTLCをデプロイ</div>
      <div>
        <div>
          相手のアドレス
          <input
            type='text'
            onChange={(event) => {
              setAddress(event.target.value)
            }}
          />
        </div>
        <div>
          ハッシュ
          <input
            type='text'
            onChange={(event) => {
              setAddress(event.target.value)
            }}
          />
        </div>
        <div>
          ロックする期間
          <input
            type='text'
            onChange={(event) => {
              setTime(Number(event.target.value))
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

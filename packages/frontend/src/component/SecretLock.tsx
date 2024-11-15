import { keccak256 } from "ethers"
import { useContext, useEffect, useState } from "react"
import { PayloadContext } from "../context/Payload"

export default () => {
  const [payload, _setPayload] = useContext(PayloadContext)
  const [address, setAddress] = useState("")
  const [hash, setHash] = useState("")
  useEffect(() => {
    setHash(keccak256(payload).substring(2).toUpperCase())
  }, [payload])
  const [value, setValue] = useState(1000000n)
  const [time, setTime] = useState(0)
  return (
    <div>
      <div>SecretLockTransaction</div>
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
      </div>
      <div>
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
      </div>
      <div>
        <div>
          ロックする期間
          <input
            type='text'
            value={time}
            onChange={(event) => {
              setTime(Number(event.target.value))
            }}
          />
        </div>
      </div>
      <div>
        <div>
          数量
          <input
            type='text'
            value={value.toString()}
            onChange={(event) => {
              setValue(BigInt(event.target.value))
            }}
          />
        </div>
      </div>
      <button>アナウンス</button>
    </div>
  )
}

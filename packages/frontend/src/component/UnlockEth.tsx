import { HTLC__factory } from "contracts"
import { useMemo } from "react"
import { useSecretEthersBrowserProviderProvider } from "../context/EthersBrowserProvider"
import { useSecretProofContext } from "../context/SecretProofProvider.tsx"
import { useEthereumContractProvider } from "../context/EthereumContractProvider.tsx"

export default () => {
  const { browserProvider } = useSecretEthersBrowserProviderProvider()
  const { proof } = useSecretProofContext()
  const { contractAddress } = useEthereumContractProvider()

  const buttonDisabled = useMemo(() => {
    return (
      proof === "" || contractAddress === "" || browserProvider === undefined
    )
  }, [proof, contractAddress, browserProvider])

  const onButtonClick = async () => {
    if (!browserProvider) {
      window.alert("BrowserProviderが無いです")
      return
    }

    const htlc = HTLC__factory.connect(
      contractAddress,
      await browserProvider.getSigner(),
    )
    await htlc.redeem(`0x${proof}`)
    window.alert("お取引が完了しました")
  }

  return (
    <div>
      <h2>お取引のご提案</h2>
      <div>
        <button type='button' onClick={onButtonClick} disabled={buttonDisabled}>
          お取引
        </button>
      </div>
    </div>
  )
}

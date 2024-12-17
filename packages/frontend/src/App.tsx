import { EIP6963DetailProvider } from "./context/EIP6963Detail"
import { PayloadProvider } from "./context/Payload"
import { EthersBrowserProviderProvider } from "./context/EthersBrowserProvider"
import EIP6963Chooser from "./component/EIP6963Chooser"
import SSSChooser from "./component/SSSChooser"
import OfferReceived from "./component/OfferReceived"
import Offer from "./component/Offer"

export default function () {
  return (
    <>
      <EthersBrowserProviderProvider>
        <EIP6963DetailProvider>
          <PayloadProvider>
			<main
				style={{
					padding: "0px",
					margin: "0px",
					backgroundColor: "black",
					color: "white",
				}}
			>
				<h1
					style={{
						fontStyle:"oblique 45deg",
						color: "cyan",
						padding: "12pt",
					}}
				>
					クロスチェーンスワップアプリ
				</h1>
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "1fr 1fr",
						gap: "10px",
						padding: "12pt",
					}}
				>
					<div
						style={{
							borderColor: "cyan",
							borderWidth: "1px",
							borderStyle: "solid",
							padding: "12pt",
						}}
					>
						<EIP6963Chooser />
					</div>
					<div
						style={{
							borderColor: "cyan",
							borderWidth: "1px",
							borderStyle: "solid",
							padding: "12pt",
						}}
					>
						<SSSChooser />
					</div>
					<div
						style={{
							borderColor: "cyan",
							borderWidth: "1px",
							borderStyle: "solid",
							padding: "12pt",
						}}
					>
						<Offer />
					</div>
					<div
						style={{
							borderColor: "cyan",
							borderWidth: "1px",
							borderStyle: "solid",
							padding: "12pt",
						}}
					>
						<OfferReceived />
					</div>
				</div>
			</main>
          </PayloadProvider>
        </EIP6963DetailProvider>
      </EthersBrowserProviderProvider>
    </>
  )
}

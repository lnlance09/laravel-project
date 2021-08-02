import { Button, Card, Container, Divider, Form, Header, Icon, Input } from "semantic-ui-react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { useContext, useState } from "react"
import { DisplayMetaTags } from "utils/metaFunctions"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import axios from "axios"
import DefaultLayout from "layouts/default"
import fileDownload from "js-file-download"
import PropTypes from "prop-types"
import ThemeContext from "themeContext"

const toastConfig = getConfig()
toast.configure(toastConfig)

const CreateWallet = ({ history }) => {
	const { state } = useContext(ThemeContext)
	const { inverted } = state

	const [loading, setLoading] = useState(false)
	const [walletAddress, setWalletAddress] = useState("")
	const [walletPrivateKey, setWalletPrivateKey] = useState("")
	const [walletPublicKey, setWalletPublicKey] = useState("")

	const createWallet = () => {
		setLoading(true)
		axios
			.post(`${process.env.REACT_APP_BASE_URL}wallet/create`)
			.then(async (response) => {
				const { address, privateKey, publicKey } = response.data.wallet
				setWalletAddress(address)
				setWalletPrivateKey(privateKey)
				setWalletPublicKey(publicKey)

				const content = `address: ${address} \npublic key: ${publicKey} \nprivate key: ${privateKey}`
				fileDownload(content, `ether-wallet-${address}-recovery.txt`)

				toast.success("Wallet successfully created!")
				setLoading(false)
			})
			.catch(() => {
				toast.error("Error create new wallet")
				setLoading(false)
			})
	}

	return (
		<DefaultLayout
			activeItem="createWallet"
			containerClassName="createWalletPage"
			history={history}
			inverted={inverted}
			textAlign="center"
		>
			<DisplayMetaTags page="createWallet" />

			<Container style={{ padding: 0 }} text>
				<Header
					as="h1"
					icon
					inverted={inverted}
					style={{ marginTop: 20 }}
					textAlign="center"
				>
					<Icon color="blue" name="ethereum" size="big" />
					Create a wallet
					<Header.Subheader>Quickly. Securely.</Header.Subheader>
				</Header>
				<Card className={inverted ? "inverted" : null} fluid>
					<Card.Content>
						<Form inverted={inverted} size="large">
							<Form.Field className="newWallet">
								<label>Address</label>
								<CopyToClipboard
									text={walletAddress}
									onCopy={() => toast.warn("Copied to clipboard")}
								>
									<Input
										fluid
										icon="paperclip"
										iconPosition="left"
										placeholder="Address"
										readOnly
										value={walletAddress}
									/>
								</CopyToClipboard>
							</Form.Field>
							<Form.Field className="newWallet">
								<label>Public key</label>
								<CopyToClipboard
									text={walletAddress}
									onCopy={() => toast.warn("Copied to clipboard")}
								>
									<Input
										fluid
										icon="paperclip"
										iconPosition="left"
										placeholder="Public key"
										readOnly
										value={walletPublicKey}
									/>
								</CopyToClipboard>
							</Form.Field>
							<Form.Field className="newWallet">
								<label>Private key</label>
								<CopyToClipboard
									text={walletAddress}
									onCopy={() => toast.warn("Copied to clipboard")}
								>
									<Input
										fluid
										icon="paperclip"
										iconPosition="left"
										placeholder="Private key"
										readOnly
										value={walletPrivateKey}
									/>
								</CopyToClipboard>
							</Form.Field>
							<Form.Field>
								<Divider inverted={inverted} />
								<Button
									color="blue"
									content="Create a wallet"
									fluid
									icon="ethereum"
									loading={loading}
									onClick={() => {
										createWallet()
									}}
									size="large"
								/>
							</Form.Field>
						</Form>
					</Card.Content>
				</Card>

				{walletAddress !== "" && (
					<Header as="p" size="small" style={{ marginTop: 5 }} textAlign="center">
						<a
							href={`https://etherscan.io/address/${walletAddress}`}
							target="_blank"
							rel="noreferrer"
						>
							view on etherscan
						</a>
					</Header>
				)}
			</Container>
		</DefaultLayout>
	)
}

CreateWallet.propTypes = {
	history: PropTypes.object
}

export default CreateWallet

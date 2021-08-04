import { Button, Card, Divider, Form, Grid, Header, Icon, Input, Menu } from "semantic-ui-react"
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

			<Header as="h1" inverted={inverted} style={{ marginTop: 20 }}>
				<Icon color="blue" name="ethereum" />
				<Header.Content>
					Create a wallet
					<Header.Subheader>Quickly. Securely.</Header.Subheader>
				</Header.Content>
			</Header>
			<Divider hidden />
			<Grid inverted={inverted} stackable>
				<Grid.Column width={12}>
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
						<div className="footerText">
							<Header as="p" size="small">
								<a
									href={`https://etherscan.io/address/${walletAddress}`}
									target="_blank"
									rel="noreferrer"
								>
									view on etherscan
								</a>
							</Header>
							<Header as="p" size="small" style={{ marginLeft: 12 }}>
								<a
									href="https://www.myetherwallet.com/wallet/access/software?type=overview"
									target="_blank"
									rel="noreferrer"
								>
									use on MEW
								</a>
							</Header>
						</div>
					)}
				</Grid.Column>
				<Grid.Column width={4}>
					<Menu color="blue" fluid inverted={inverted} size="big" vertical>
						<Menu.Item active onClick={() => null}>
							<Icon name="ethereum" />
							Ethereum
						</Menu.Item>
						{/*
						<Menu.Item onClick={() => null}>
							<Icon name="bitcoin" />
							Bitcoin
						</Menu.Item>
						*/}
					</Menu>
				</Grid.Column>
			</Grid>
		</DefaultLayout>
	)
}

CreateWallet.propTypes = {
	history: PropTypes.object
}

export default CreateWallet

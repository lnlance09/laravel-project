import "./style.scss"
import { useEffect, useState } from "react"
import {
	Button,
	Divider,
	Dropdown,
	Form,
	Header,
	Icon,
	Image,
	Input,
	Segment
} from "semantic-ui-react"
import { cashOptions, timeOptions, yearsOptions } from "options/application"
import { ethers } from "ethers"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import { isValidTxCode } from "utils/textFunctions"
import axios from "axios"
import PropTypes from "prop-types"
import QRCode from "react-qr-code"
import validator from "validator"
import Web3 from "web3"

const toastConfig = getConfig()
toast.configure(toastConfig)

const Application = ({ auth, close = () => null, history, inverted, user = {} }) => {
	const [cash, setCash] = useState(0)
	const [coinId, setCoinId] = useState(1)
	const [coinOptions, setCoinOptions] = useState([])
	const [email, setEmail] = useState(user.email)
	const [name, setName] = useState(auth ? user.name : "")
	const [page, setPage] = useState(1)
	const [portfolio, setPortfolio] = useState([])
	const [timeFrame, setTimeFrame] = useState("short")
	const [txCode, setTxCode] = useState("")
	const [yearsInCrypto, setYearsInCrypto] = useState(0)

	useEffect(() => {
		const loadPage = async () => {
			const coins = await getCoins()
			setCoinOptions(coins)
		}

		loadPage()
	}, [])

	const getCoins = async () => {
		return await axios
			.get(`${process.env.REACT_APP_BASE_URL}coins/options`)
			.then((response) => {
				const coins = response.data.data
				return coins
			})
			.catch(() => {})
	}

	const onChangeCash = async (e, { value }) => {
		setCash(value)
	}

	const onChangeCoin = async (e, { value }) => {
		setCoinId(value)
	}

	const onChangeEmail = async (e, { value }) => {
		setEmail(value)
	}

	const onChangeName = async (e, { value }) => {
		setName(value)
	}

	const onChangePortfolio = async (e, { value }) => {
		setPortfolio(value)
	}

	const onChangeTimeFrame = async (e, { value }) => {
		setTimeFrame(value)
	}

	const onChangeTxCode = async (e, { value }) => {
		setTxCode(value)
	}

	const onChangeYear = async (e, { value }) => {
		setYearsInCrypto(value)
	}

	const openMetaMask = async () => {
		window.web3 = new Web3(window.ethereum)
		await window.ethereum.enable()

		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const signer = provider.getSigner()
		// const balance = await provider.getBalance("0xddfabcdc4d8ffc6d5beaf154f18b778f892a0740")
		// console.log("signer", signer)
		// console.log(await provider.getBlockNumber())
		// console.log("balance", ethers.utils.formatEther(balance))

		try {
			const tx = signer.sendTransaction({
				to: "0xddfabcdc4d8ffc6d5beaf154f18b778f892a0740",
				value: ethers.utils.parseEther("1.0")
			})
		} catch (e) {
			console.log("tx", e)
		}
	}

	const sendApplication = async () => {
		axios
			.post(`${process.env.REACT_APP_BASE_URL}users/apply`, {
				cash,
				coin: coinId,
				email,
				name,
				portfolio,
				time: timeFrame,
				tx: txCode,
				user: user.id,
				years: yearsInCrypto
			})
			.then(async (response) => {})
			.catch((error) => {
				toast.error(error.response.data.message)
			})
	}

	const BasicQuestions = (
		<Form inverted={inverted} size="large">
			<Form.Field>
				<label>What coin would you like me to review?</label>
				<Dropdown
					className={inverted ? "inverted" : null}
					fluid
					onChange={onChangeCoin}
					options={coinOptions}
					selection
					size="medium"
					value={coinId}
				/>
			</Form.Field>
			<Form.Field>
				<label>What time frame?</label>
				<Dropdown
					className={inverted ? "inverted" : null}
					fluid
					onChange={onChangeTimeFrame}
					options={timeOptions}
					selection
					size="medium"
					value={timeFrame}
				/>
			</Form.Field>
		</Form>
	)

	const AdditionalQuestions = (
		<>
			<Header inverted={inverted}>
				{user.predictionsReserved === 1 && (
					<Icon color="pink" name="heart" style={{ fontSize: "16px" }} />
				)}
				<Header.Content>A few more questions...</Header.Content>
			</Header>
			<Divider hidden />
			<Form inverted={inverted} size="large">
				<Form.Group widths="equal">
					<Form.Field>
						<label>How long have you been in crypto?</label>
						<Dropdown
							className={inverted ? "inverted" : null}
							fluid
							onChange={onChangeYear}
							options={yearsOptions}
							selection
							size="medium"
							value={yearsInCrypto}
						/>
					</Form.Field>
					<Form.Field>
						<label>How much have you made in crypto?</label>
						<Dropdown
							className={inverted ? "inverted" : null}
							fluid
							onChange={onChangeCash}
							options={cashOptions}
							selection
							size="medium"
							value={cash}
						/>
					</Form.Field>
				</Form.Group>
				<Form.Field>
					<label>What other coins do you like for your portfolio?</label>
					<Dropdown
						className={inverted ? "inverted" : null}
						fluid
						multiple
						onChange={onChangePortfolio}
						options={coinOptions}
						selection
						size="medium"
						value={portfolio}
					/>
				</Form.Field>
				<Button
					animated
					color="blue"
					fluid
					onClick={() => {
						const page = auth ? 3 : 2
						setPage(page)
						window.scroll({ top: 0, behavior: "smooth" })
					}}
					size="large"
				>
					<Button.Content visible>Next</Button.Content>
					<Button.Content hidden>
						<Icon name="arrow right" />
					</Button.Content>
				</Button>
			</Form>
		</>
	)

	const ContactQuestions = (
		<>
			<Header inverted={inverted}>
				<Header.Content>Your contact info</Header.Content>
			</Header>
			<Form inverted={inverted} size="large">
				<Form.Field>
					<Input
						inverted={inverted}
						onChange={onChangeName}
						placeholder="Name"
						value={name}
					/>
				</Form.Field>
				<Form.Field>
					<Input
						inverted={inverted}
						onChange={onChangeEmail}
						placeholder="Email"
						value={email}
					/>
				</Form.Field>
				<Button
					animated
					color="blue"
					fluid
					onClick={() => {
						if (name.length < 3) {
							toast.error("Name is not long enough")
							return
						}

						if (!validator.isEmail(email)) {
							toast.error("Email is not valid")
							return
						}

						setPage(3)
						window.scroll({ top: 0, behavior: "smooth" })
					}}
					size="large"
				>
					<Button.Content visible>Next</Button.Content>
					<Button.Content hidden>
						<Icon name="arrow right" />
					</Button.Content>
				</Button>
			</Form>
		</>
	)

	const TransactionQuestions = (
		<>
			<Header inverted={inverted}>
				<Header.Content>Transaction Info</Header.Content>
			</Header>
			<Header as="p" inverted={inverted} size="small">
				Send ETH to:{" "}
				<a
					href={`https://etherscan.io/address/${user.primaryWallet}`}
					target="_blank"
					rel="noreferrer"
				>
					{user.primaryWallet}
				</a>
			</Header>
			<Segment inverted={inverted} textAlign="center">
				<div className="qrWrapper">
					<QRCode value="hey" />
				</div>
			</Segment>
			<Form inverted={inverted} size="large">
				<Form.Field>
					<Input
						inverted={inverted}
						onChange={onChangeTxCode}
						placeholder="Transaction code"
						value={txCode}
					/>
				</Form.Field>
				<Button
					color="blue"
					content="Complete"
					disabled={!isValidTxCode(txCode)}
					fluid
					onClick={sendApplication}
					size="large"
				/>
			</Form>
		</>
	)

	return (
		<div className={`applicationComponent ${inverted ? "inverted" : null}`}>
			<Header inverted={inverted} size="large">
				<Image circular src={user.img} />
				<Header.Content>
					{user.name}
					<Header.Subheader>@{user.username}</Header.Subheader>
				</Header.Content>
				<Icon
					color="blue"
					inverted={inverted}
					name="arrow left"
					onClick={() => {
						if (page === 1) {
							close()
						}

						if (page === 2) {
							setPage(page - 1)
						}

						if (page === 3) {
							const newPage = auth ? 1 : 2
							setPage(newPage)
						}
					}}
					size="small"
				/>
			</Header>

			{page === 1 && (
				<>
					<Divider hidden />
					{BasicQuestions}
					{AdditionalQuestions}
				</>
			)}
			{page === 2 && ContactQuestions}
			{page === 3 && TransactionQuestions}
		</div>
	)
}

Application.propTypes = {
	auth: PropTypes.bool,
	close: PropTypes.func,
	history: PropTypes.object,
	inverted: PropTypes.bool,
	user: PropTypes.shape({
		email: PropTypes.string,
		id: PropTypes.number,
		img: PropTypes.string,
		name: PropTypes.string,
		predictionsReserved: PropTypes.number,
		primaryWallet: PropTypes.string,
		username: PropTypes.string
	})
}

export default Application

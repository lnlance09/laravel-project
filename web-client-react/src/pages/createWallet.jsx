import { Card, Divider, Grid, Header, Image, Label, Menu } from "semantic-ui-react"
import { useContext, useEffect, useReducer, useState } from "react"
import { DisplayMetaTags } from "utils/metaFunctions"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import axios from "axios"
import DefaultLayout from "layouts/default"
import initialState from "states/wallet"
import logger from "use-reducer-logger"
import PropTypes from "prop-types"
import reducer from "reducers/wallet"
import ThemeContext from "themeContext"
import Wallet from "components/Wallet/"

const toastConfig = getConfig()
toast.configure(toastConfig)

const CreateWallet = ({ history, match }) => {
	const { state } = useContext(ThemeContext)
	const { inverted } = state
	let { symbol } = match.params

	if (typeof symbol === "undefined") {
		symbol = "ETH"
	}

	const [internalState, dispatchInternal] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)
	const { coin, coins } = internalState
	const [activeItem, setActiveItem] = useState(symbol)

	useEffect(() => {
		getWalletCoins()
		// eslint-disable-next-line
	}, [])

	const getWalletCoins = () => {
		axios
			.get(`${process.env.REACT_APP_BASE_URL}coins/coinsWithWallets`)
			.then(async (response) => {
				const { data } = response.data
				dispatchInternal({
					type: "GET_COINS",
					data
				})

				const coin = data.filter((coin) => coin.symbol === activeItem)
				dispatchInternal({
					type: "SET_COIN_DATA",
					coin: coin[0]
				})
			})
			.catch(() => {
				console.error("Error loading wallets")
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
			<DisplayMetaTags page="createWallet" state={internalState} />

			<Header as="h1" inverted={inverted} style={{ marginTop: 20 }}>
				<Image
					circular
					src={`https://preditc.s3.us-west-2.amazonaws.com/${coin.logo}`}
					size="huge"
				/>
				<Header.Content>
					Create a wallet
					<Header.Subheader>Quickly. Securely.</Header.Subheader>
				</Header.Content>
			</Header>

			<Divider hidden />

			<Grid inverted={inverted} stackable>
				<Grid.Column width={11}>
					<Wallet coin={coin} inverted={inverted} />
				</Grid.Column>
				<Grid.Column width={5}>
					<Card className={`relax menuCard ${inverted ? "inverted" : null}`} fluid>
						<Card.Content>
							<Menu
								fluid
								inverted={inverted}
								primary
								relaxed="very"
								size="huge"
								vertical
							>
								{coins.map((coin, i) => {
									return (
										<Menu.Item
											active={activeItem === coin.symbol}
											key={`coinWallet${i}`}
											onClick={() => {
												setActiveItem(coin.symbol)
												dispatchInternal({
													type: "SET_COIN_DATA",
													coin
												})
												window.history.replaceState(
													null,
													`Create a new ${coin.name} wallet`,
													`/wallet/create/${coin.symbol}`
												)
											}}
										>
											{coin.name}
											{coin.fork ? (
												<Label
													color={coin.fork === "BTC" ? "orange" : "blue"}
												>
													Fork of {coin.fork}
												</Label>
											) : null}
										</Menu.Item>
									)
								})}
							</Menu>
						</Card.Content>
					</Card>
				</Grid.Column>
			</Grid>
			<Divider hidden />
		</DefaultLayout>
	)
}

CreateWallet.propTypes = {
	history: PropTypes.object
}

export default CreateWallet

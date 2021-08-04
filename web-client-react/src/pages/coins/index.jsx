import {
	Card,
	Divider,
	Grid,
	Header,
	Image,
	Loader,
	Placeholder,
	Segment,
	Statistic,
	Visibility
} from "semantic-ui-react"
import { useContext, useEffect, useReducer, useState } from "react"
import { DisplayMetaTags } from "utils/metaFunctions"
import { formatNumber } from "utils/textFunctions"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import axios from "axios"
import Chart from "components/Chart"
import DefaultLayout from "layouts/default"
import initialState from "states/coin"
import Linkify from "react-linkify"
import logger from "use-reducer-logger"
import NumberFormat from "react-number-format"
import PlaceholderPic from "images/images/image-square.png"
import PredictionForm from "components/PredictionForm"
import PredictionList from "components/PredictionList"
import PropTypes from "prop-types"
import reducer from "reducers/coin"
import ThemeContext from "themeContext"

const toastConfig = getConfig()
toast.configure(toastConfig)

const Coin = ({ history, match }) => {
	const { state } = useContext(ThemeContext)
	const { auth, inverted } = state
	const { slug } = match.params

	const [internalState, dispatch] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)
	const { coin, loaded, traders } = internalState

	const [hasMore, setHasMore] = useState(false)
	const [loading, setLoading] = useState(true)
	const [loadingMore, setLoadingMore] = useState(false)
	const [page, setPage] = useState(1)

	useEffect(() => {
		const getCoin = async (slug) => {
			await axios
				.get(`${process.env.REACT_APP_BASE_URL}coins/${slug}`)
				.then(async (response) => {
					const coin = response.data.data
					dispatch({
						type: "GET_COIN",
						coin
					})
					getTraders(coin.id)
					getPredictions(coin.id)
				})
				.catch(() => {
					toast.error("There was an error")
				})
		}

		getCoin(slug)
	}, [slug])

	const getPredictions = async (coinId, page = 1) => {
		if (page === 1) {
			setLoading(true)
		} else {
			setLoadingMore(true)
		}

		await axios
			.get(`${process.env.REACT_APP_BASE_URL}predictions`, {
				params: {
					coinId,
					page
				}
			})
			.then((response) => {
				const { data, meta } = response.data
				dispatch({
					type: "GET_PREDICTIONS",
					predictions: data,
					page
				})
				setPage(page + 1)
				setHasMore(meta.current_page < meta.last_page)
				if (page === 1) {
					setLoading(false)
				} else {
					setLoadingMore(false)
				}
			})
			.catch(() => {
				toast.error("There was an error")
			})
	}

	const getTraders = async (id) => {
		await axios
			.get(`${process.env.REACT_APP_BASE_URL}coins/topTraders`, {
				params: {
					coinId: id
				}
			})
			.then((response) => {
				const { data } = response.data
				dispatch({
					type: "GET_TRADERS",
					traders: data
				})
			})
			.catch(() => {
				console.error("Last price could not be fetched")
			})
	}

	const onClickPrediction = (e, id) => {
		if (!e.metaKey) {
			history.push(`/predictions/${id}`)
		} else {
			window.open(`/predictions/${id}`, "_blank").focus()
		}
	}

	return (
		<DefaultLayout
			activeItem="coins"
			containerClassName="coinPage"
			history={history}
			inverted={inverted}
		>
			<DisplayMetaTags page="coin" state={internalState} />
			{loaded && traders.loaded ? (
				<>
					<Header as="h1" inverted={inverted}>
						<Image
							circular
							onError={(i) => (i.target.src = PlaceholderPic)}
							size="huge"
							src={coin.logo}
						/>
						<Header.Content>
							{coin.name}
							<Header.Subheader>
								<NumberFormat
									decimalScale={coin.lastPrice > 1 ? 2 : 6}
									displayType={"text"}
									prefix={"$"}
									thousandSeparator
									value={coin.lastPrice}
								/>
							</Header.Subheader>
						</Header.Content>
					</Header>
					<Header as="p" inverted={inverted}>
						<Linkify
							properties={{
								target: "_blank"
							}}
						>
							{coin.description}
						</Linkify>
					</Header>

					<Header as="h2" className="dividerHeader" inverted={inverted} size="huge">
						Metrics
					</Header>

					<Grid className="metricsGrid" padded="vertically" stackable textAlign="center">
						<Grid.Row columns={5}>
							<Grid.Column>
								<Statistic color="orange" inverted={inverted}>
									<Statistic.Value>
										{formatNumber(coin.marketCap)}
									</Statistic.Value>
									<Statistic.Label>Market Cap</Statistic.Label>
								</Statistic>
							</Grid.Column>
							<Grid.Column>
								<Statistic color="blue" inverted={inverted}>
									<Statistic.Value>
										{formatNumber(coin.volume24h)}
									</Statistic.Value>
									<Statistic.Label>24H Volume</Statistic.Label>
								</Statistic>
							</Grid.Column>
							<Grid.Column>
								<Statistic color="yellow" inverted={inverted}>
									<Statistic.Value>
										{formatNumber(coin.circulatingSupply)}
									</Statistic.Value>
									<Statistic.Label>Circ Supply</Statistic.Label>
								</Statistic>
							</Grid.Column>
							<Grid.Column>
								<Statistic color="teal" inverted={inverted}>
									<Statistic.Value>
										{formatNumber(coin.totalSupply)}
									</Statistic.Value>
									<Statistic.Label>Total Supply</Statistic.Label>
								</Statistic>
							</Grid.Column>
							<Grid.Column>
								<Statistic color="violet" inverted={inverted}>
									<Statistic.Value>
										{formatNumber(coin.maxSupply)}
									</Statistic.Value>
									<Statistic.Label>Max Supply</Statistic.Label>
								</Statistic>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row columns={4}>
							<Grid.Column>
								<Statistic
									color={coin.percentages["1h"] > 0 ? "green" : "red"}
									inverted={inverted}
								>
									<Statistic.Value>
										{coin.percentages["1h"] > 0 ? "+" : null}
										{coin.percentages["1h"]}%
									</Statistic.Value>
									<Statistic.Label>1H Change</Statistic.Label>
								</Statistic>
							</Grid.Column>
							<Grid.Column>
								<Statistic
									color={coin.percentages["24h"] > 0 ? "green" : "red"}
									inverted={inverted}
								>
									<Statistic.Value>
										{coin.percentages["24h"] > 0 ? "+" : null}
										{coin.percentages["24h"]}%
									</Statistic.Value>
									<Statistic.Label>24H Change</Statistic.Label>
								</Statistic>
							</Grid.Column>
							<Grid.Column>
								<Statistic
									color={coin.percentages["7d"] > 0 ? "green" : "red"}
									inverted={inverted}
								>
									<Statistic.Value>
										{coin.percentages["7d"] > 0 ? "+" : null}
										{coin.percentages["7d"]}%
									</Statistic.Value>
									<Statistic.Label>7D Change</Statistic.Label>
								</Statistic>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row columns={3}>
							<Grid.Column>
								<Statistic
									color={coin.percentages["30d"] > 0 ? "green" : "red"}
									inverted={inverted}
								>
									<Statistic.Value>
										{coin.percentages["30d"] > 0 ? "+" : null}
										{coin.percentages["30d"]}%
									</Statistic.Value>
									<Statistic.Label>30D Change</Statistic.Label>
								</Statistic>
							</Grid.Column>
							<Grid.Column>
								<Statistic
									color={coin.percentages["60d"] > 0 ? "green" : "red"}
									inverted={inverted}
								>
									<Statistic.Value>
										{coin.percentages["60d"] > 0 ? "+" : null}
										{coin.percentages["60d"]}%
									</Statistic.Value>
									<Statistic.Label>60D Change</Statistic.Label>
								</Statistic>
							</Grid.Column>
							<Grid.Column>
								<Statistic
									color={coin.percentages["90d"] > 0 ? "green" : "red"}
									inverted={inverted}
								>
									<Statistic.Value>
										{coin.percentages["90d"] > 0 ? "+" : null}
										{coin.percentages["90d"]}%
									</Statistic.Value>
									<Statistic.Label>90D Change</Statistic.Label>
								</Statistic>
							</Grid.Column>
						</Grid.Row>
					</Grid>

					<Header as="h2" className="dividerHeader" inverted={inverted} size="huge">
						Performance
					</Header>

					<Chart coin={coin} color="#0097e6" inverted={inverted} />

					<Header as="h2" className="dividerHeader" inverted={inverted} size="huge">
						Make a Prediction
					</Header>

					<Card className={inverted ? "inverted" : null} fluid>
						<Card.Content>
							<PredictionForm
								auth={auth}
								coin={coin}
								defaultPrice={coin.lastPrice * 1.8}
								history={history}
								inverted={inverted}
							/>
						</Card.Content>
					</Card>

					<Header as="h2" className="dividerHeader" inverted={inverted} size="huge">
						Best {coin.symbol} Traders
					</Header>

					{traders.data.length > 0 && traders.loaded ? (
						<Card.Group
							className={`traderList ${inverted ? "inverted" : null}`}
							itemsPerRow={4}
							stackable
						>
							{traders.data.map((trader, i) => {
								let accuracy = 0
								if (traders.loaded) {
									accuracy = trader.accuracy.toFixed(2)
								}

								return (
									<Card
										key={`topTrader${i}`}
										onClick={(e) => {
											const url = `/${trader.username}`
											if (!e.metaKey) {
												history.push(url)
											} else {
												window.open(url, "_blank").focus()
											}
										}}
									>
										{!traders.loaded ? (
											<>
												<Placeholder inverted={inverted} fluid>
													<Placeholder.Image />
												</Placeholder>
											</>
										) : (
											<>
												<Image
													onError={(i) => (i.target.src = PlaceholderPic)}
													src={trader.img}
												/>
												<Card.Content>
													<Card.Header>{trader.name}</Card.Header>
													<Card.Meta>@{trader.username}</Card.Meta>
													<Card.Description>
														{trader.bio}
													</Card.Description>
												</Card.Content>
												<Card.Content extra>
													<p>
														{accuracy}% accurate with {coin.name}
													</p>
												</Card.Content>
											</>
										)}
									</Card>
								)
							})}
						</Card.Group>
					) : (
						<Segment className="centeredMsg" inverted={inverted}>
							<Header
								content="No predictions yet..."
								inverted={inverted}
								size="large"
								textAlign="center"
							/>
						</Segment>
					)}

					<Divider hidden />

					<Header as="h2" className="dividerHeader" inverted={inverted} size="huge">
						Predictions
					</Header>

					<Divider hidden />

					<Visibility
						continuous
						offset={[50, 50]}
						onBottomVisible={() => {
							if (!loading && !loadingMore && hasMore) {
								getPredictions(coin.id, page)
							}
						}}
					>
						<PredictionList
							inverted={inverted}
							loading={loading}
							loadingMore={loadingMore}
							predictions={internalState.predictions}
							onClickPrediction={onClickPrediction}
						/>
					</Visibility>
					<Divider hidden section />
				</>
			) : (
				<div className="centeredLoader">
					<Loader active inverted={inverted} size="big" />
				</div>
			)}
		</DefaultLayout>
	)
}

Coin.propTypes = {
	history: PropTypes.object,
	match: PropTypes.object
}

export default Coin

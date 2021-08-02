import {
	Button,
	Card,
	Divider,
	Header,
	Icon,
	Image,
	Label,
	List,
	Loader,
	Segment
} from "semantic-ui-react"
import { useContext, useEffect, useReducer } from "react"
import { DisplayMetaTags } from "utils/metaFunctions"
import { RedditShareButton, TwitterShareButton } from "react-share"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import { dateDiff } from "utils/dateFunctions"
import { setIconColor, setIconName } from "utils/textFunctions"
import axios from "axios"
import Chart from "components/Chart"
import DefaultLayout from "layouts/default"
import initialState from "states/prediction"
import logger from "use-reducer-logger"
import moment from "moment"
import Moment from "react-moment"
import NumberFormat from "react-number-format"
import PlaceholderPic from "images/images/image-square.png"
import PropTypes from "prop-types"
import reducer from "reducers/prediction"
import ThemeContext from "themeContext"
import UserPic from "images/avatar/large/steve.jpg"

const toastConfig = getConfig()
toast.configure(toastConfig)

const Prediction = ({ history, match }) => {
	const { dispatch, state } = useContext(ThemeContext)
	const { inverted } = state
	const { slug } = match.params
	const params = new URLSearchParams(window.location.search)
	const clear = params.get("clear")

	const [internalState, dispatchInternal] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)
	const { loaded, prediction } = internalState

	useEffect(() => {
		const getPrediction = async (slug) => {
			await axios
				.get(`${process.env.REACT_APP_BASE_URL}predictions/${slug}`)
				.then(async (response) => {
					const prediction = response.data.data
					dispatchInternal({
						type: "GET_PREDICTION",
						prediction
					})
				})
				.catch(() => {
					toast.error("There was an error")
				})
		}

		if (clear === "1") {
			clearNotification(slug)
		}

		getPrediction(slug)
		// eslint-disable-next-line
	}, [slug])

	const clearNotification = (slug) => {
		dispatch({
			type: "CLEAR_NOTIFICATION",
			id: parseInt(slug, 10)
		})
	}

	const getDuration = () => {
		const { createdAt, targetDate } = prediction
		const daysDiff = dateDiff(createdAt, targetDate)
		const range = Math.round(daysDiff / 2)

		const startDate = moment(createdAt).subtract(range, "days").unix()
		const endDate = moment(targetDate).add(range, "days").unix()

		const rangeFilter = `${startDate}~${endDate}`
		return rangeFilter
	}

	const { coin, createdAt, currentPrice, predictionPrice, status, targetDate, user } = prediction
	const title = loaded
		? `${coin.symbol} to ${predictionPrice} on ${moment(targetDate).format("MMM D, YYYY")}`
		: ""

	return (
		<DefaultLayout
			activeItem="predictions"
			containerClassName="predictionPage"
			history={history}
			inverted={inverted}
		>
			<DisplayMetaTags page="prediction" state={internalState} />
			{loaded ? (
				<>
					<Header as="h1" className="predictionHeader" inverted={inverted}>
						<Image
							circular
							onClick={() => history.push(`/coins/${coin.slug}`)}
							onError={(i) => (i.target.src = PlaceholderPic)}
							size="huge"
							src={coin.logo}
						/>
						<Header.Content>
							{coin.symbol} to{" "}
							<NumberFormat
								decimalScale={predictionPrice > 1 ? 2 : 8}
								displayType={"text"}
								prefix={"$"}
								thousandSeparator
								value={predictionPrice}
							/>
							<Header.Subheader>
								Predicted <Moment date={createdAt} fromNow /> •{" "}
								<Moment date={createdAt} format="MMM D, YYYY" />
							</Header.Subheader>
						</Header.Content>
					</Header>

					<Card className={inverted ? "inverted" : null} fluid>
						<Card.Content>
							<Chart
								addSeries
								coin={coin}
								containerProps={{ style: { height: "250px" } }}
								duration={getDuration()}
								hideYAxis
								includeRanges={false}
								inverted={inverted}
								prediction={{
									currentPrice: currentPrice,
									date: moment(targetDate).unix(),
									price: predictionPrice
								}}
								startDate={moment(createdAt).unix()}
							/>
						</Card.Content>
					</Card>

					<Card className={`${inverted ? "inverted" : null}`} fluid>
						<Card.Content>
							<Card.Description>{prediction.explanation}</Card.Description>
						</Card.Content>
						<Card.Content extra>
							<span className="left floated">
								<TwitterShareButton
									title={title}
									url={`${window.location.origin}/predictions/${slug}`}
								>
									<Icon className="twitterIcon" name="twitter" size="large" />
								</TwitterShareButton>
							</span>
							<span className="left floated">
								<RedditShareButton
									url={`${window.location.origin}/predictions/${slug}`}
								>
									<Icon className="redditIcon" name="reddit" size="large" />
								</RedditShareButton>
							</span>
						</Card.Content>
					</Card>

					<Header as="h2" className="dividerHeader" inverted={inverted} size="huge">
						Stats
					</Header>

					<Segment basic inverted={inverted} style={{ paddingLeft: 0, paddingRight: 0 }}>
						<List divided inverted={inverted} relaxed="very" size="big">
							<List.Item>
								Status
								<Label
									basic
									className={inverted ? "inverted" : ""}
									color={setIconColor(status)}
									horizontal
									size="large"
								>
									<Icon name={setIconName(status)} /> {status}
								</Label>
							</List.Item>
							<List.Item>
								Target Date
								<Label
									basic
									className={inverted ? "inverted" : ""}
									color="pink"
									horizontal
									size="large"
								>
									<Moment date={targetDate} format="MMM D, YYYY" />
								</Label>
							</List.Item>
							<List.Item>
								Original Price
								<Label
									basic
									className={inverted ? "inverted" : ""}
									color="orange"
									horizontal
									size="large"
								>
									<NumberFormat
										decimalScale={prediction.currentPrice > 1 ? 2 : 8}
										displayType={"text"}
										prefix={"$"}
										thousandSeparator
										value={prediction.currentPrice}
									/>
								</Label>
							</List.Item>
							<List.Item>
								Prediction Price
								<Label
									basic
									className={inverted ? "inverted" : ""}
									color="yellow"
									horizontal
									size="large"
								>
									<NumberFormat
										decimalScale={predictionPrice > 1 ? 2 : 8}
										displayType={"text"}
										prefix={"$"}
										thousandSeparator
										value={predictionPrice}
									/>
								</Label>
							</List.Item>
							<List.Item>
								Actual price
								<Label
									basic
									className={inverted ? "inverted" : ""}
									color="violet"
									horizontal
									size="large"
								>
									{status === "Pending" ? (
										"N/A"
									) : (
										<NumberFormat
											decimalScale={prediction.actualPrice > 1 ? 2 : 8}
											displayType={"text"}
											prefix={"$"}
											thousandSeparator
											value={prediction.actualPrice}
										/>
									)}
								</Label>
							</List.Item>
							<List.Item>
								Margin of error
								<Label
									basic
									className={inverted ? "inverted" : ""}
									color="teal"
									horizontal
									size="large"
								>
									{status === "Pending" ? "N/A" : `${prediction.margin}%`}
								</Label>
							</List.Item>
							<List.Item>
								Prediction length
								<Label
									basic
									className={inverted ? "inverted" : ""}
									color="olive"
									horizontal
									size="large"
								>
									{dateDiff(createdAt, targetDate)} days
								</Label>
							</List.Item>
						</List>
					</Segment>

					<Header as="h2" className="dividerHeader" inverted={inverted} size="huge">
						Predicter
					</Header>

					<Card className={`${inverted ? "inverted" : null}`}>
						<Image
							as="a"
							onClick={() => history.push(`/${user.username}`)}
							onError={(i) => (i.target.src = UserPic)}
							src={user.img}
						/>
						<Card.Content>
							<Card.Header>{user.name}</Card.Header>
							<Card.Meta>
								<span className="date">@{user.username}</span>
							</Card.Meta>
							<Card.Description>{user.bio}</Card.Description>
						</Card.Content>
						<Button
							animated="fade"
							attached="bottom"
							color={user.predictionsReserved === 1 ? "pink" : "blue"}
							onClick={() => history.push(`/${user.username}`)}
						>
							<Button.Content visible>Get a prediction</Button.Content>
							<Button.Content hidden>Ask {user.name.split(" ")[0]}</Button.Content>
						</Button>
					</Card>

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

Prediction.propTypes = {
	history: PropTypes.object,
	match: PropTypes.object
}

export default Prediction

import {
	Button,
	Container,
	Divider,
	Grid,
	Header,
	Image,
	Label,
	List,
	Loader,
	Segment,
	Transition,
	Visibility
} from "semantic-ui-react"
import { useContext, useEffect, useReducer, useState } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { DisplayMetaTags } from "utils/metaFunctions"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import Application from "components/Application"
import axios from "axios"
import DefaultLayout from "layouts/default"
import ImageUpload from "components/ImageUpload"
import initialState from "states/trader"
import logger from "use-reducer-logger"
import PlaceholderPic from "images/avatar/large/steve.jpg"
import PredictionList from "components/PredictionList"
import PropTypes from "prop-types"
import reducer from "reducers/trader"
import ThemeContext from "themeContext"

const toastConfig = getConfig()
toast.configure(toastConfig)

const Trader = ({ history, match }) => {
	const { state } = useContext(ThemeContext)
	const { auth, bearer, inverted, user } = state
	const { username } = match.params

	const [internalState, dispatch] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)
	const { loaded, predictions, trader } = internalState

	const [activeItem, setActiveItem] = useState(null)
	const [applicationVisible, setApplicationVisible] = useState(false)
	const [hasMore, setHasMore] = useState(false)
	const [imageLoaded, setImageLoaded] = useState(false)
	const [loadingMore, setLoadingMore] = useState(false)
	const [page, setPage] = useState(1)

	useEffect(() => {
		const getTrader = async (user) => {
			await axios
				.get(`${process.env.REACT_APP_BASE_URL}users/${username}`)
				.then(async (response) => {
					const trader = response.data.data
					dispatch({
						type: "GET_TRADER",
						trader
					})
					getPredictions(trader.id, null)
				})
				.catch(() => {
					toast.error("There was an error")
				})
		}

		getTrader(username)
	}, [username])

	const getPredictions = async (userId, status, sort = "created_at", dir = "desc", page = 1) => {
		dispatch({
			type: "SET_LOADING_PREDICTIONS"
		})

		await axios
			.get(`${process.env.REACT_APP_BASE_URL}predictions`, {
				params: {
					userId,
					status,
					sort,
					dir,
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
				if (page > 1) {
					setLoadingMore(false)
				}
			})
			.catch(() => {
				toast.error("There was an error")
			})
	}

	const onClickPrediction = (e, id) => {
		if (!e.metaKey) {
			history.push(`/predictions/${id}`)
		} else {
			window.open(`/predictions/${id}`, "_blank").focus()
		}
	}

	const changeProfilePic = async (file) => {
		const formData = new FormData()
		formData.set("file", file)

		await axios
			.post(`${process.env.REACT_APP_BASE_URL}users/profilePic`, formData, {
				headers: {
					Authorization: `Bearer ${bearer}`,
					"Content-Type": "multipart/form-data",
					enctype: "multipart/form-data"
				}
			})
			.then((response) => {
				const { data } = response.data
				localStorage.setItem("user", JSON.stringify(data))

				dispatch({
					type: "GET_TRADER",
					trader: data
				})
			})
			.catch((error) => {
				let errorMsg = ""
				const { status } = error.response
				const { errors } = error.response.data

				if (status === 403) {
					errorMsg = error.response.data.message
				} else {
					if (typeof errors.file !== "undefined") {
						errorMsg = errors.file[0]
					}
				}

				toast.error(errorMsg)
			})
	}

	const isMyProfile = auth ? trader.id === user.id : false

	const ProfilePic = () => {
		if (auth && trader.id === user.id) {
			return (
				<ImageUpload
					callback={(file) => changeProfilePic(file)}
					img={trader.img === null ? PlaceholderPic : trader.img}
					inverted={inverted}
				/>
			)
		}

		return (
			<Image
				bordered
				circular
				className={`inverted smooth-image image-${imageLoaded ? "visible" : "hidden"}`}
				onError={(i) => (i.target.src = PlaceholderPic)}
				onLoad={() => setImageLoaded(true)}
				style={{
					height: 175,
					width: 175
				}}
				src={trader.img}
			/>
		)
	}

	return (
		<DefaultLayout
			activeItem="traders"
			containerClassName="traderPage"
			history={history}
			inverted={inverted}
			textAlign="center"
		>
			<DisplayMetaTags page="trader" state={internalState} />
			{loaded ? (
				<>
					{!applicationVisible && (
						<>
							<Grid stackable>
								<Grid.Row>
									<Grid.Column className="imgColumn" width={4}>
										<Segment circular>{ProfilePic()}</Segment>
									</Grid.Column>
									<Grid.Column width={12}>
										<Header as="h1" inverted={inverted}>
											<Header.Content>
												{trader.name}
												<Header.Subheader>
													@{trader.username}
												</Header.Subheader>
											</Header.Content>
											<Label
												basic
												className={inverted ? "inverted" : null}
												color="blue"
											>
												{trader.accuracy.toFixed(2)} %
											</Label>
										</Header>
										<Header
											as="p"
											inverted={inverted}
											size="small"
											style={{ marginTop: 0 }}
										>
											ETH:{" "}
											<CopyToClipboard
												text={trader.primaryWallet}
												onCopy={() => toast.warn("Copied to clipboard")}
											>
												<span className="primaryWallet blue">
													{trader.primaryWallet}
												</span>
											</CopyToClipboard>
										</Header>
										{trader.bio !==
										"Apparently, this trader prefers to keep an air of mystery about them." ? (
											<Header
												as="p"
												inverted={inverted}
												size="small"
												style={{ marginTop: 0 }}
											>
												{trader.bio}
											</Header>
										) : null}
										{!isMyProfile ? (
											<Button
												className="getPredictionBtn"
												color={
													trader.predictionsReserved === 1
														? "pink"
														: "blue"
												}
												compact
												content="Get a prediction"
												icon="arrow right"
												onClick={() => {
													setApplicationVisible(true)
													window.scroll({ top: 0, behavior: "smooth" })
												}}
												style={{ display: "block" }}
											/>
										) : null}
										<List horizontal inverted={inverted} size="large">
											<List.Item
												as="a"
												className={activeItem === null ? "active" : null}
												onClick={() => {
													setActiveItem(null)
													getPredictions(trader.id, null)
												}}
											>
												<List.Content>
													<List.Header>
														{trader.predictionsCount} total
													</List.Header>
												</List.Content>
											</List.Item>
											<List.Item
												as="a"
												className={
													activeItem === "Correct" ? "active" : null
												}
												onClick={() => {
													setActiveItem("Correct")
													getPredictions(trader.id, "Correct")
												}}
											>
												<List.Content>
													<List.Header>
														<span className="green">
															{trader.correctPredictionsCount}
														</span>{" "}
														correct
													</List.Header>
												</List.Content>
											</List.Item>
											<List.Item
												as="a"
												className={
													activeItem === "Incorrect" ? "active" : null
												}
												onClick={() => {
													setActiveItem("Incorrect")
													getPredictions(trader.id, "Incorrect")
												}}
											>
												<List.Content>
													<List.Header>
														<span className="red">
															{trader.incorrectPredictionsCount}
														</span>{" "}
														wrong
													</List.Header>
												</List.Content>
											</List.Item>
											<List.Item
												as="a"
												className={
													activeItem === "Pending" ? "active" : null
												}
												onClick={() => {
													setActiveItem("Pending")
													getPredictions(trader.id, "Pending")
												}}
											>
												<List.Content>
													<List.Header>
														<span className="orange">
															{trader.pendingPredictionsCount}
														</span>{" "}
														pending
													</List.Header>
												</List.Content>
											</List.Item>
										</List>
									</Grid.Column>
								</Grid.Row>
							</Grid>

							<Divider className="traderPageDivider" hidden section />

							<Visibility
								continuous
								offset={[50, 50]}
								onBottomVisible={() => {
									if (!predictions.loading && !loadingMore && hasMore) {
										getPredictions(
											trader.id,
											activeItem,
											"created_at",
											"desc",
											page
										)
									}
								}}
							>
								<PredictionList
									inverted={inverted}
									loading={predictions.loading}
									loadingMore={loadingMore}
									predictions={predictions.data}
									onClickPrediction={onClickPrediction}
								/>
							</Visibility>

							<Divider hidden />
						</>
					)}

					<Transition animation="scale" duration={500} visible={applicationVisible}>
						<Container text>
							<Segment basic inverted={inverted}>
								<Application
									auth={auth}
									close={() => setApplicationVisible(false)}
									inverted={inverted}
									user={{
										email: auth ? user.email : "",
										id: trader.id,
										img: trader.img,
										name: trader.name,
										predictionsReserved: trader.predictionsReserved,
										primaryWallet: trader.primaryWallet,
										username: trader.username
									}}
								/>
							</Segment>
						</Container>
					</Transition>
				</>
			) : (
				<>
					<div className="centeredLoader">
						<Loader active inverted={inverted} size="big" />
					</div>
				</>
			)}
		</DefaultLayout>
	)
}

Trader.propTypes = {
	history: PropTypes.object,
	match: PropTypes.object
}

export default Trader

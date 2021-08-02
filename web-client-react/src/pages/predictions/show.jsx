import { Button, Divider, Dropdown, Grid, Icon, Visibility } from "semantic-ui-react"
import { useContext, useEffect, useReducer, useState } from "react"
import { DisplayMetaTags } from "utils/metaFunctions"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import { setIcon } from "utils/textFunctions"
import { statusOptions } from "options/status"
import axios from "axios"
import PredictionList from "components/PredictionList"
import DefaultLayout from "layouts/default"
import initialState from "states/predictions"
import logger from "use-reducer-logger"
import PropTypes from "prop-types"
import reducer from "reducers/predictions"
import ThemeContext from "themeContext"

const toastConfig = getConfig()
toast.configure(toastConfig)

const Predictions = ({ history }) => {
	const { state } = useContext(ThemeContext)
	const { inverted } = state

	const [internalState, dispatch] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)
	const [activeItem, setActiveItem] = useState("created_at")
	const [coinId, setCoinId] = useState(null)
	const [coinName, setCoinName] = useState("")
	const [coinOptions, setCoinOptions] = useState([])
	const [createdAt, setCreatedAt] = useState("desc")
	const [direction, setDirection] = useState(null)
	const [hasMore, setHasMore] = useState(false)
	const [loading, setLoading] = useState(true)
	const [loadingMore, setLoadingMore] = useState(false)
	const [margin, setMargin] = useState(null)
	const [page, setPage] = useState(1)
	const [status, setStatus] = useState(null)
	const [targetDate, setTargetDate] = useState(null)

	useEffect(() => {
		const loadPage = async () => {
			getPredictions(null, null, null, null)
			const coins = await getCoins()
			setCoinOptions(coins)
		}

		loadPage()
	}, [])

	const getPredictions = async (coinId, status, sort, dir, page = 1) => {
		if (page === 1) {
			setLoading(true)
		} else {
			setLoadingMore(true)
		}

		await axios
			.get(`${process.env.REACT_APP_BASE_URL}predictions`, {
				params: {
					coinId,
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

	const getCoins = async () => {
		return await axios
			.get(`${process.env.REACT_APP_BASE_URL}coins/options?showCounts=1`)
			.then((response) => {
				const coins = response.data.data
				return coins
			})
			.catch(() => {})
	}

	const onChangeStatus = (e, { value }) => {
		setStatus(value)
		getPredictions(coinId, value, activeItem, direction)
	}

	const onChangeCoin = async (e, { value }) => {
		setCoinId(value)
		const name = await coinOptions.filter((coin) => coin.value === value)
		setCoinName(name[0].name)
		const sort = activeItem === "coin" ? null : activeItem
		getPredictions(value, status, sort, direction)
	}

	const onClickPrediction = (e, id) => {
		if (!e.metaKey) {
			history.push(`/predictions/${id}`)
		} else {
			window.open(`/predictions/${id}`, "_blank").focus()
		}
	}

	const toggleCreatedAt = () => {
		const newVal = createdAt === null || createdAt === "desc" ? "asc" : "desc"
		setCreatedAt(newVal)
		setActiveItem("created_at")
		setDirection(newVal)
		getPredictions(coinId, status, "created_at", newVal)
	}

	const toggleMargin = () => {
		const newVal = margin === null || margin === "desc" ? "asc" : "desc"
		setMargin(newVal)
		setActiveItem("margin")
		setDirection(newVal)
		getPredictions(coinId, status, "margin", newVal)
	}

	const toggleTargetDate = () => {
		const newVal = targetDate === null || targetDate === "desc" ? "asc" : "desc"
		setTargetDate(newVal)
		setActiveItem("target_date")
		setDirection(newVal)
		getPredictions(coinId, status, "target_date", newVal)
	}

	return (
		<DefaultLayout
			activeItem="predictions"
			containerClassName="predictionsPage"
			history={history}
			inverted={inverted}
		>
			<DisplayMetaTags page="predictions" state={internalState} />

			<Grid stackable style={{ marginTop: 12 }}>
				<Grid.Column width={4}>
					<Dropdown
						className={inverted ? "inverted" : null}
						fluid
						icon={false}
						onChange={onChangeCoin}
						options={coinOptions}
						scrolling
						trigger={
							<Button
								active={activeItem === "coin"}
								color="blue"
								fluid
								icon={coinId ? true : false}
								inverted={inverted}
								onClick={() => setActiveItem("coin")}
								size="big"
							>
								{coinId ? coinName : "Coin"}
								{coinId && (
									<Icon
										name="close"
										onClick={(e) => {
											e.stopPropagation()
											setCoinId(null)
											setCoinName("")
											getPredictions(null, status, activeItem, direction)
										}}
										style={{ float: "right" }}
									/>
								)}
							</Button>
						}
					/>
				</Grid.Column>
				<Grid.Column width={3}>
					<Dropdown
						className={inverted ? "inverted" : null}
						fluid
						icon={false}
						onChange={onChangeStatus}
						options={statusOptions}
						trigger={
							<Button
								active={activeItem === "status"}
								color="blue"
								content="Status"
								fluid
								inverted={inverted}
								onClick={() => setActiveItem("status")}
								size="big"
							/>
						}
					/>
				</Grid.Column>
				<Grid.Column width={3}>
					<Button
						active={activeItem === "created_at"}
						color="blue"
						content="Created At"
						fluid
						icon={activeItem === "created_at" && setIcon(createdAt)}
						inverted={inverted}
						onClick={toggleCreatedAt}
						size="big"
					/>
				</Grid.Column>
				<Grid.Column width={3}>
					<Button
						active={activeItem === "target_date"}
						color="blue"
						content="Date"
						fluid
						icon={activeItem === "target_date" && setIcon(targetDate)}
						inverted={inverted}
						onClick={toggleTargetDate}
						size="big"
					/>
				</Grid.Column>
				<Grid.Column width={3}>
					<Button
						active={activeItem === "margin"}
						color="blue"
						content="Margin"
						fluid
						icon={activeItem === "margin" && setIcon(margin)}
						inverted={inverted}
						onClick={toggleMargin}
						size="big"
					/>
				</Grid.Column>
			</Grid>
			<Divider hidden />
			<Visibility
				continuous
				offset={[50, 50]}
				onBottomVisible={() => {
					if (!loading && !loadingMore && hasMore) {
						getPredictions(coinId, status, activeItem, direction, page)
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
		</DefaultLayout>
	)
}

Predictions.propTypes = {
	history: PropTypes.object,
	match: PropTypes.object
}

export default Predictions

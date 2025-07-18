import { Button, Divider, Grid, Header, Visibility } from "semantic-ui-react"
import { useContext, useEffect, useReducer, useState } from "react"
import { DebounceInput } from "react-debounce-input"
import { DisplayMetaTags } from "utils/metaFunctions"
import { getConfig } from "options/toast"
import { setIcon } from "utils/textFunctions"
import { toast } from "react-toastify"
import axios from "axios"
import DefaultLayout from "layouts/default"
import initialState from "states/traders"
import logger from "use-reducer-logger"
import PropTypes from "prop-types"
import reducer from "reducers/traders"
import ThemeContext from "themeContext"
import TraderList from "components/TraderList/"

const toastConfig = getConfig()
toast.configure(toastConfig)

const Traders = ({ history }) => {
	const { state } = useContext(ThemeContext)
	const { inverted } = state

	const [internalState, dispatch] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)
	const [accuracy, setAccuracy] = useState("desc")
	const [activeItem, setActiveItem] = useState("accuracy")
	const [direction, setDirection] = useState("desc")
	const [hasMore, setHasMore] = useState(false)
	const [loading, setLoading] = useState(true)
	const [loadingMore, setLoadingMore] = useState(false)
	const [page, setPage] = useState(1)
	const [predictions, setPredictions] = useState(null)
	const [searchTerm, setSearchTerm] = useState("")

	useEffect(() => {
		getTraders(searchTerm, activeItem, direction)
	}, [searchTerm, activeItem, direction])

	const getTraders = async (q, sort, dir, page = 1) => {
		if (page === 1) {
			setLoading(true)
		} else {
			setLoadingMore(true)
		}

		await axios
			.get(`${process.env.REACT_APP_BASE_URL}users`, {
				params: {
					q,
					sort,
					dir,
					page
				}
			})
			.then((response) => {
				const { data, meta } = response.data
				dispatch({
					type: "GET_TRADERS",
					traders: data,
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

	const onChangeText = (e) => {
		setSearchTerm(e.target.value)
	}

	const onClickTrader = (e, username) => {
		if (!e.metaKey) {
			history.push(`/${username}`)
		} else {
			window.open(`/${username}`, "_blank").focus()
		}
	}

	const toggleAccuracy = () => {
		const newVal = accuracy === null || accuracy === "desc" ? "asc" : "desc"
		setAccuracy(newVal)
		setActiveItem("accuracy")
		setDirection(newVal)
	}

	const togglePredictions = () => {
		const newVal = predictions === null || predictions === "desc" ? "asc" : "desc"
		setPredictions(newVal)
		setActiveItem("predictions")
		setDirection(newVal)
	}

	return (
		<DefaultLayout
			activeItem="traders"
			containerClassName="tradersPage"
			history={history}
			inverted={inverted}
		>
			<DisplayMetaTags page="traders" state={internalState} />
			<Header as="h1" className="massive" inverted={inverted}>
				Traders
			</Header>
			<Grid stackable>
				<Grid.Row>
					<Grid.Column width={10}>
						<div className={`ui icon input big fluid ${inverted ? "inverted" : ""}`}>
							<DebounceInput
								debounceTimeout={700}
								minLength={2}
								onChange={onChangeText}
								placeholder="Search..."
								value={searchTerm}
							/>
						</div>
					</Grid.Column>
					<Grid.Column width={3}>
						<Button
							active={activeItem === "accuracy"}
							color="green"
							content="Accuracy"
							fluid
							icon={activeItem === "accuracy" && setIcon(accuracy)}
							inverted={inverted}
							onClick={toggleAccuracy}
							size="big"
						/>
					</Grid.Column>
					<Grid.Column width={3}>
						<Button
							active={activeItem === "predictions"}
							color="blue"
							content="Predictions"
							fluid
							icon={activeItem === "predictions" && setIcon(predictions)}
							inverted={inverted}
							onClick={togglePredictions}
							size="big"
						/>
					</Grid.Column>
				</Grid.Row>
			</Grid>
			<Divider hidden />
			<Visibility
				continuous
				offset={[50, 50]}
				onBottomVisible={() => {
					if (!loading && !loadingMore && hasMore) {
						getTraders(searchTerm, activeItem, direction, page)
					}
				}}
			>
				<TraderList
					inverted={inverted}
					loading={loading}
					loadingMore={loadingMore}
					onClickTrader={onClickTrader}
					traders={internalState.traders}
				/>
			</Visibility>
			<Divider hidden section />
		</DefaultLayout>
	)
}

Traders.propTypes = {
	history: PropTypes.object
}

export default Traders

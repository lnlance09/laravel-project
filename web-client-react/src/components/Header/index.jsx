import "./style.scss"
import {
	Button,
	Container,
	Dropdown,
	Header,
	Icon,
	Image,
	Label,
	Menu,
	Sidebar
} from "semantic-ui-react"
import { ReactSVG } from "react-svg"
import { useContext, useEffect, useReducer, useState } from "react"
import axios from "axios"
import defaultImg from "images/images/image.png"
import Echo from "laravel-echo"
import initialState from "./state"
import logger from "use-reducer-logger"
import Logo from "images/logos/blockchain.svg"
import moment from "moment"
import NumberFormat from "react-number-format"
import PropTypes from "prop-types"
import reducer from "./reducer"
import ThemeContext from "themeContext"

window.Pusher = require("pusher-js")

const PageHeader = ({ activeItem, history, q, simple }) => {
	const { state, dispatch } = useContext(ThemeContext)
	const { auth, bearer, inverted, memberCount, notifications, unreadCount, user } = state

	const [internalState, dispatchInternal] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)
	const { messages } = internalState

	const [sidebarVisible, setSidebarVisible] = useState(false)

	useEffect(() => {
		if (typeof window.Echo === "undefined") {
			if (auth) {
				window.Echo = new Echo({
					auth: {
						headers: {
							Authorization: `Bearer ${bearer}`
						}
					},
					authEndpoint: "http://localhost/broadcasting/auth",
					broadcaster: "pusher",
					cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER,
					key: process.env.REACT_APP_PUSHER_APP_KEY,
					forceTLS: true
				})

				window.Echo.private(`users.${user.id}`).listen("ApplicationSent", (e) => {
					console.log("application", e)
					incrementNotification()
				})
			} else {
				window.Echo = new Echo({
					broadcaster: "pusher",
					cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER,
					key: process.env.REACT_APP_PUSHER_APP_KEY,
					forceTLS: true
				})
			}

			window.Echo.channel("publicPredictions").listen("PredictionCreated", (e) => {
				console.log("prediction", e)
				const { prediction } = e
				addNotification(prediction)
			})
		}

		getMemberCount()

		if (auth) {
			getUnreadCount()
			getMessages()
		}
		// eslint-disable-next-line
	}, [])

	const addNotification = (prediction) => {
		dispatch({
			type: "SET_NOTIFICATIONS",
			prediction
		})
	}

	const clearAllNotifications = () => {
		localStorage.removeItem("notifications")
		dispatch({
			type: "CLEAR_ALL_NOTIFICATIONS"
		})
	}

	const incrementNotification = () => {
		dispatch({
			type: "INCREMENT_UNREAD_COUNT"
		})
	}

	const getMemberCount = async () => {
		axios
			.get(`${process.env.REACT_APP_BASE_URL}users/all`)
			.then(async (response) => {
				const { count } = response.data
				dispatch({
					type: "SET_MEMBER_COUNT",
					count
				})
			})
			.catch(() => {
				console.error("Error fetching member count")
			})
	}

	const getMessages = async () => {
		axios
			.get(`${process.env.REACT_APP_BASE_URL}applications`, {
				params: {
					perPage: 5
				},
				headers: {
					Authorization: `Bearer ${bearer}`
				}
			})
			.then(async (response) => {
				const { data } = response.data
				dispatchInternal({
					type: "SET_MESSAGES",
					messages: data
				})
			})
			.catch(() => {
				console.error("Error fetching messages")
			})
	}

	const getUnreadCount = async () => {
		axios
			.get(`${process.env.REACT_APP_BASE_URL}applications`, {
				params: {
					justCount: 1,
					unread: 1
				},
				headers: {
					Authorization: `Bearer ${bearer}`
				}
			})
			.then(async (response) => {
				const { count } = response.data
				dispatch({
					type: "SET_UNREAD_COUNT",
					count
				})
			})
			.catch(() => {
				console.error("Error fetching unread count")
			})
	}

	const logout = () => {
		localStorage.removeItem("auth")
		localStorage.removeItem("bearer")
		localStorage.removeItem("unreadCount")
		localStorage.removeItem("user")
		localStorage.removeItem("verify")
		window.Echo.leave(`users.${user.id}`)
		dispatch({
			type: "LOGOUT"
		})
	}

	const BellDropdown = (
		<Dropdown
			className={`bellDropdown ${inverted ? "inverted" : null}`}
			direction="left"
			icon={false}
			pointing="top"
			trigger={
				<div className="trigger item">
					<Icon circular color="yellow" name="bell" size="large" />
					{notifications.length > 0 && (
						<div className="top floating ui red label">{notifications.length}</div>
					)}
				</div>
			}
		>
			<Dropdown.Menu>
				{notifications.length === 0 ? (
					<>
						<Dropdown.Item>
							<Dropdown.Header>You're all up to date!</Dropdown.Header>
						</Dropdown.Item>
					</>
				) : (
					<>
						{notifications.map((item) => {
							const text = `${item.user.name} predicted ${item.coin.symbol} at $${
								item.predictionPrice
							} on ${moment(item.targetDate).format("MMM D")}`
							return (
								<Dropdown.Item
									className="paddedDropdownItem"
									image={{ avatar: true, src: item.user.img }}
									key={item.id}
									onClick={() => history.push(`/predictions/${item.id}?clear=1`)}
									text={text}
									value={item.id}
								/>
							)
						})}
						<>
							<Dropdown.Divider />
							<Dropdown.Header>
								<Button
									color="red"
									compact
									content="Clear all"
									onClick={clearAllNotifications}
								/>
							</Dropdown.Header>
						</>
					</>
				)}
			</Dropdown.Menu>
		</Dropdown>
	)

	const MessageDropdown = (
		<Dropdown
			className={inverted ? "inverted" : null}
			direction="left"
			icon={false}
			pointing="top"
			trigger={
				<div className="trigger item">
					<Icon circular color="green" name="usd" size="large" />
					{unreadCount > 0 && (
						<div className="top floating ui red label">{unreadCount}</div>
					)}
				</div>
			}
		>
			<Dropdown.Menu>
				{auth ? (
					<>
						{messages.map((item) => {
							const text = `${item.name} has requested a ${item.time} term review of ${item.coin.symbol}`
							return (
								<Dropdown.Item
									className="paddedDropdownItem"
									image={{ avatar: true, src: item.coin.logo }}
									key={item.id}
									onClick={() => history.push(`/applications/${item.id}`)}
									text={text}
									value={item.id}
								/>
							)
						})}
						{messages.length > 0 ? (
							<>
								<Dropdown.Divider />
								<Dropdown.Header>
									<Button
										color="green"
										compact
										content="View all messages"
										onClick={() => history.push("/applications")}
									/>
								</Dropdown.Header>
							</>
						) : (
							<Header content="No messages" inverted={inverted} size="small" />
						)}
					</>
				) : (
					<>
						<Dropdown.Item>
							<Dropdown.Header>
								Sign in to start getting paid for your predictions
							</Dropdown.Header>
						</Dropdown.Item>
						<Dropdown.Divider />
						<Dropdown.Header>
							<Button
								color="blue"
								compact
								content="Sign In"
								onClick={() => history.push("/login")}
							/>
						</Dropdown.Header>
					</>
				)}
			</Dropdown.Menu>
		</Dropdown>
	)

	const ProfileDropdown = (
		<Dropdown
			className={`profileDropdown ${inverted ? "inverted" : null}`}
			icon={false}
			pointing="top"
			trigger={
				<>
					{user && (
						<>
							<span style={{ marginLeft: "12px", marginRight: "12px" }}>
								{user.name}
							</span>
							<Image
								avatar
								bordered
								onError={(i) => (i.target.src = defaultImg)}
								src={user.img}
							/>
						</>
					)}
				</>
			}
		>
			<Dropdown.Menu>
				<Dropdown.Item onClick={() => history.push(`/${user.username}`)}>
					Profile
				</Dropdown.Item>
				<Dropdown.Item onClick={() => history.push("/settings")}>Settings</Dropdown.Item>
				<Dropdown.Item onClick={() => history.push("/settings?tab=wallets")}>
					Wallets
				</Dropdown.Item>
				<Dropdown.Divider />
				<Dropdown.Item onClick={logout}>Sign Out</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown>
	)

	return (
		<div className="pageHeaderComponent">
			{simple ? (
				<Container className="basicHeaderContainer" fluid textAlign="center">
					<ReactSVG className="simpleLogo" onClick={() => history.push("/")} src={Logo} />
				</Container>
			) : (
				<Menu borderless fixed="top" fluid inverted={inverted}>
					<Container className="desktop">
						<Menu.Item className="logoItem">
							<ReactSVG
								className="simpleLogo"
								onClick={() => history.push("/")}
								src={Logo}
							/>
							<Header as="h1" inverted={inverted} onClick={() => history.push("/")}>
								Preditc
							</Header>
						</Menu.Item>
						<Menu.Item
							active={activeItem === "coins"}
							onClick={() => {
								history.push("/coins")
							}}
						>
							Coins
						</Menu.Item>
						<Menu.Item
							active={activeItem === "predictions"}
							onClick={() => history.push("/predictions")}
						>
							Predictions
						</Menu.Item>
						<Menu.Item
							active={activeItem === "traders"}
							onClick={() => history.push("/traders")}
						>
							Traders{" "}
							{memberCount > 0 && (
								<Label className={inverted ? "inverted" : null} color="olive">
									<NumberFormat
										displayType={"text"}
										thousandSeparator
										value={memberCount}
									/>
								</Label>
							)}
						</Menu.Item>
						<Menu.Item position="right">
							<Icon
								circular
								className="moonButton"
								color={inverted ? "orange" : "purple"}
								name={inverted ? "sun" : "moon"}
								onClick={() => {
									const inverted = localStorage.getItem("inverted")
									localStorage.setItem(
										"inverted",
										inverted === "false" ? "true" : "false"
									)
									dispatch({ type: "TOGGLE_INVERTED" })
								}}
								size="large"
							/>
							{BellDropdown}
							{MessageDropdown}
							{auth ? (
								<>{ProfileDropdown}</>
							) : (
								<>
									<Button
										compact
										content="Log In"
										onClick={() => history.push("/login")}
										secondary
										size="large"
									/>
									<Button
										compact
										color="green"
										content="Sign Up"
										onClick={() => history.push("/login?type=join")}
										size="large"
									/>
								</>
							)}
						</Menu.Item>
					</Container>

					<Container className="mobile">
						<Menu.Item className="logoItem">
							<ReactSVG
								className="simpleLogo"
								onClick={() => history.push("/")}
								src={Logo}
							/>
						</Menu.Item>
						<Menu.Item position="right">
							{BellDropdown}
							{MessageDropdown}
							<Icon
								color={sidebarVisible ? "green" : null}
								inverted
								name="ellipsis horizontal"
								onClick={() => setSidebarVisible(!sidebarVisible)}
								size="big"
							/>
						</Menu.Item>
					</Container>
				</Menu>
			)}

			<Sidebar
				as={Menu}
				direction="bottom"
				icon="labeled"
				inverted={inverted}
				onHide={() => setSidebarVisible(false)}
				size="massive"
				style={{ textAlign: "left" }}
				vertical
				visible={sidebarVisible}
			>
				<Menu.Item as="a" onClick={() => history.push("/predictions")}>
					🔮 Predictions
				</Menu.Item>
				<Menu.Item as="a" onClick={() => history.push("/traders")}>
					📈 Traders
				</Menu.Item>
				<Menu.Item as="a" onClick={() => history.push("/coins")}>
					🪙 Coins
				</Menu.Item>
				{auth ? (
					<Menu.Item as="a" onClick={() => history.push(`/${user.username}`)}>
						🌞 Profile
					</Menu.Item>
				) : (
					<Menu.Item as="a" onClick={() => history.push("/login")}>
						👉 Sign In
					</Menu.Item>
				)}
			</Sidebar>
		</div>
	)
}

PageHeader.propTypes = {
	activeItem: PropTypes.string,
	history: PropTypes.object,
	q: PropTypes.string,
	simple: PropTypes.bool,
	toggleSearchMode: PropTypes.func
}

PageHeader.defaultProps = {
	activeItem: null,
	q: "",
	simple: false
}

export default PageHeader

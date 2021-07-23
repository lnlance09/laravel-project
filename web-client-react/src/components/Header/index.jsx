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
import { useContext, useEffect, useState } from "react"
import axios from "axios"
import defaultImg from "images/images/image.png"
import Logo from "images/logos/blockchain.svg"
import NumberFormat from "react-number-format"
import PropTypes from "prop-types"
import ThemeContext from "themeContext"

const PageHeader = ({ activeItem, history, q, simple }) => {
	const { state, dispatch } = useContext(ThemeContext)
	const { auth, inverted, memberCount, user } = state
	const [sidebarVisible, setSidebarVisible] = useState(false)

	useEffect(() => {
		getMemberCount()
		// eslint-disable-next-line
	}, [])

	const getMemberCount = async () => {
		return axios
			.get(`${process.env.REACT_APP_BASE_URL}users/all`)
			.then(async (response) => {
				const { count } = response.data
				dispatch({
					type: "SET_MEMBER_COUNT",
					count
				})
			})
			.catch(() => {
				console.error("Last price could not be fetched")
			})
	}

	const logout = () => {
		localStorage.setItem("auth", false)
		localStorage.setItem("bearer", null)
		localStorage.setItem("user", null)
		localStorage.setItem("verify", false)
		dispatch({
			type: "LOGOUT"
		})
	}

	const trigger = (
		<>
			{user && (
				<>
					<span style={{ marginLeft: "12px", marginRight: "12px" }}>{user.name}</span>
					<Image
						avatar
						bordered
						onError={(i) => (i.target.src = defaultImg)}
						src={user.img}
					/>
				</>
			)}
		</>
	)

	const ProfileDropdown = (
		<Dropdown
			className={inverted ? "inverted" : null}
			icon={false}
			pointing="top"
			trigger={trigger}
		>
			<Dropdown.Menu>
				<Dropdown.Item onClick={() => history.push(`/${user.username}`)}>
					Profile
				</Dropdown.Item>
				<Dropdown.Item onClick={() => history.push("/settings")}>Settings</Dropdown.Item>
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
							<Button
								circular
								color={inverted ? "yellow" : "purple"}
								className="moonButton"
								icon
								onClick={() => {
									const inverted = localStorage.getItem("inverted")
									localStorage.setItem(
										"inverted",
										inverted === "false" ? "true" : "false"
									)
									dispatch({ type: "TOGGLE_INVERTED" })
								}}
							>
								<Icon
									inverted={inverted}
									name={inverted ? "sun" : "moon"}
									size="large"
								/>
							</Button>
							{auth ? (
								<>{ProfileDropdown}</>
							) : (
								<>
									<Button
										content="Log In"
										onClick={() => history.push("/login")}
										secondary
										size="large"
									/>
									<Button
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
							<Icon
								color={sidebarVisible ? "blue" : null}
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
					Predictions
				</Menu.Item>
				<Menu.Item as="a" onClick={() => history.push("/traders")}>
					Traders
				</Menu.Item>
				<Menu.Item as="a" onClick={() => history.push("/coins")}>
					Coins
				</Menu.Item>
				{auth ? (
					<Menu.Item as="a" onClick={() => history.push(`/${user.username}`)}>
						Profile
					</Menu.Item>
				) : (
					<Menu.Item as="a" onClick={() => history.push("/login")}>
						Sign In
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

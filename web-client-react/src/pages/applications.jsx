import {
	Button,
	Divider,
	Form,
	Grid,
	Header,
	Icon,
	Image,
	Item,
	Label,
	List,
	Menu,
	Placeholder,
	Segment,
	TextArea
} from "semantic-ui-react"
import { useContext, useEffect, useReducer, useState } from "react"
import { getCashText, getTimeText, getYearsText } from "options/application"
import { DisplayMetaTags } from "utils/metaFunctions"
import { capitalizeWord } from "utils/textFunctions"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import axios from "axios"
import defaultImg from "images/images/image.png"
import DefaultLayout from "layouts/default"
import initialState from "states/applications"
import Linkify from "react-linkify"
import logger from "use-reducer-logger"
import moment from "moment"
import Moment from "react-moment"
import PropTypes from "prop-types"
import reducer from "reducers/applications"
import ThemeContext from "themeContext"

const toastConfig = getConfig()
toast.configure(toastConfig)

const Applications = ({ history }) => {
	const { state, dispatch } = useContext(ThemeContext)
	const { auth, bearer, inverted, unreadCount } = state

	const [activeItem, setActiveItem] = useState("unread")
	const [key, setKey] = useState(1)
	const [reply, setReply] = useState("")

	const [internalState, dispatchInternal] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)
	const { loaded, messages, noReplyCount } = internalState

	useEffect(() => {
		if (!auth) {
			history.push("/")
			return
		}

		getMessages({ unread: 1 })
		getMsgCount()
		// eslint-disable-next-line
	}, [auth])

	const getMsgCount = async () => {
		const noReply = await getMessages({ justCount: 1, responses: "empty" }, false)
		dispatchInternal({
			type: "SET_NO_REPLY_COUNT",
			count: noReply
		})
	}

	const getMessages = async (params = {}, dispatch = true) => {
		return await axios
			.get(`${process.env.REACT_APP_BASE_URL}applications`, {
				params,
				headers: {
					Authorization: `Bearer ${bearer}`
				}
			})
			.then(async (response) => {
				const { count, data } = response.data
				if (dispatch) {
					dispatchInternal({
						type: "SET_MESSAGES",
						messages: data
					})
				} else {
					return count
				}
			})
			.catch(() => {
				toast.error("Error fetching messages")
			})
	}

	const onChangeReply = (e, { value }) => {
		setReply(value)
	}

	const setMsgRead = (id, i) => {
		axios
			.post(
				`${process.env.REACT_APP_BASE_URL}applications/${id}/update`,
				{
					unread: false
				},
				{
					headers: {
						Authorization: `Bearer ${bearer}`
					}
				}
			)
			.then((response) => {
				const { data } = response.data
				dispatchInternal({
					type: "MARK_AS_READ",
					message: data,
					i
				})
				dispatch({
					type: "DECREMENT_UNREAD_COUNT"
				})
			})
			.catch(() => {
				console.error("Error marking message as read")
			})
	}

	const submitResponse = (id, i) => {
		axios
			.post(
				`${process.env.REACT_APP_BASE_URL}applications/${id}/respond`,
				{
					response: reply
				},
				{
					headers: {
						Authorization: `Bearer ${bearer}`
					}
				}
			)
			.then(async (response) => {
				const { data } = response.data
				dispatchInternal({
					type: "SET_RESPONSE",
					message: data,
					i
				})
			})
			.catch(() => {
				toast.error("Error posting a response")
			})
	}

	const msg = messages.length > 0 ? messages[key] : null

	return (
		<DefaultLayout
			activeItem="applications"
			containerClassName="applicationsPage"
			history={history}
			inverted={inverted}
			textAlign="center"
		>
			<DisplayMetaTags page="applications" />

			<Header as="h1" inverted={inverted}>
				Applications
			</Header>

			<Divider hidden />

			<Menu inverted={inverted} secondary size="large">
				<Menu.Item
					active={activeItem === "read"}
					name="read"
					onClick={() => {
						setActiveItem("read")
						getMessages({ unread: 0 })
					}}
				/>
				<Menu.Item
					active={activeItem === "unread"}
					name="unread"
					onClick={() => {
						setActiveItem("unread")
						getMessages({ unread: 1 })
					}}
				>
					Unread {unreadCount > 0 ? <Label color="red">{unreadCount}</Label> : ""}
				</Menu.Item>
				<Menu.Item
					active={activeItem === "not yet responded"}
					name="not yet responded"
					onClick={() => {
						setActiveItem("not yet responded")
						getMessages({ responses: "empty" })
					}}
				>
					Not Yet Responded{" "}
					{noReplyCount > 0 ? <Label color="red">{noReplyCount}</Label> : ""}
				</Menu.Item>
			</Menu>
			<Segment className="messagesContainer" inverted={inverted}>
				<Grid inverted={inverted} divider="vertically" stackable>
					<Grid.Column width={6}>
						{messages.length > 0 ? (
							<Item.Group
								className={`${inverted ? "inverted" : null}`}
								divided
								relaxed
							>
								{messages.map((item, i) => {
									if (loaded) {
										return (
											<Item
												key={`msg${i}`}
												className={i === key ? "selected" : null}
												onClick={() => {
													setKey(i)
													if (item.unread) {
														setMsgRead(item.id, i)
													}
													setReply("")
													window.scroll({ top: 0, behavior: "smooth" })
												}}
											>
												<Item.Image
													onError={(i) => (i.target.src = defaultImg)}
													size="tiny"
													src={item.coin.logo}
												/>
												<Item.Content>
													<Item.Header>
														{capitalizeWord(item.time)}-term{" "}
														{item.coin.symbol} prediction
													</Item.Header>
													<Item.Meta>
														Requested{" "}
														<Moment date={item.createdAt} fromNow />
													</Item.Meta>
													<Item.Meta>
														{item.unread ? (
															<>
																<Icon color="yellow" name="mail" />{" "}
																Unread
															</>
														) : (
															<>
																<Icon name="eye" /> Read{" "}
																{moment(item.updatedAt).fromNow()}
															</>
														)}
													</Item.Meta>
													<Item.Meta>
														{item.responses.data.length === 0 ? (
															<>
																<Icon
																	color="orange"
																	name="hourglass"
																/>{" "}
																You haven't responded yet...
															</>
														) : (
															<>
																<Icon
																	color="green"
																	name="checkmark"
																/>{" "}
																Responded{" "}
																{moment(
																	item.responses.data[0].createdAt
																).fromNow()}
															</>
														)}
													</Item.Meta>
												</Item.Content>
											</Item>
										)
									}

									return (
										<Item key={`msg${i}`}>
											<Placeholder
												inverted={inverted}
												style={{ height: 40, marginRight: 14, width: 40 }}
											>
												<Placeholder.Image />
											</Placeholder>
											<Item.Content>
												<Placeholder inverted={inverted} fluid>
													<Placeholder.Paragraph>
														<Placeholder.Line />
														<Placeholder.Line />
													</Placeholder.Paragraph>
												</Placeholder>
											</Item.Content>
										</Item>
									)
								})}
							</Item.Group>
						) : (
							<div className="centeredMsg">
								<Header inverted={inverted} textAlign="center">
									Empty
								</Header>
							</div>
						)}
					</Grid.Column>
					<Grid.Column width={10}>
						{loaded && msg ? (
							<>
								<Header as="h2" inverted={inverted}>
									{msg.name}
									<Header.Subheader>{msg.email}</Header.Subheader>
									<Header.Subheader>
										<Icon name="clock outline" style={{ fontSize: 13 }} />
										Requested <Moment date={msg.createdAt} fromNow />
									</Header.Subheader>
								</Header>

								<Header
									inverted={inverted}
									size="medium"
									style={{ wordBreak: "break-all" }}
								>
									Tx:{" "}
									<a
										href={`https://etherscan.io/tx/${msg.tx}`}
										target="_blank"
										rel="noreferrer"
									>
										{msg.tx}
									</a>
								</Header>

								<Divider hidden />

								<List divided inverted={inverted} relaxed="very" size="big">
									<List.Item>
										coin
										<Label
											basic
											className={inverted ? "inverted" : ""}
											color="blue"
											horizontal
											size="large"
										>
											{msg.coin.name}
										</Label>
									</List.Item>
									<List.Item>
										time frame
										<Label
											basic
											className={inverted ? "inverted" : ""}
											color="blue"
											horizontal
											size="large"
										>
											{getTimeText(msg.time)}
										</Label>
									</List.Item>
									<List.Item>
										$ made in crypto
										<Label
											basic
											className={inverted ? "inverted" : ""}
											color="green"
											horizontal
											size="large"
										>
											{getCashText(msg.cash)}
										</Label>
									</List.Item>
									<List.Item>
										time in crypto
										<Label
											basic
											className={inverted ? "inverted" : ""}
											color="yellow"
											horizontal
											size="large"
										>
											{getYearsText(msg.years)}
										</Label>
									</List.Item>
								</List>

								<Header content="Portfolio" inverted={inverted} />

								<Label.Group color="blue" size="large">
									{msg.portfolio.data.map((item) => (
										<Label
											as="a"
											onClick={() => history.push(`/coins/${item.coin.slug}`)}
										>
											{item.coin.name}
										</Label>
									))}
								</Label.Group>

								{msg.responses.data.length === 0 ? (
									<Form inverted={inverted} size="large">
										<Divider inverted={inverted} section />
										<TextArea
											className={inverted ? "inverted" : null}
											onChange={onChangeReply}
											placeholder={`Respond to ${msg.name}`}
											rows={6}
											value={reply}
										/>
										<Divider inverted={inverted} />
										<Button
											color="blue"
											content="Respond"
											disabled={reply === ""}
											fluid
											onClick={() => submitResponse(msg.id, key)}
											size="large"
										/>
									</Form>
								) : (
									<>
										<Header as="h3" inverted={inverted}>
											<Image avatar src={msg.user.img} />
											<Header.Content>
												{msg.user.name}
												<Header.Subheader>
													You responded{" "}
													<Moment
														date={msg.responses.data[0].createdAt}
														fromNow
													/>
												</Header.Subheader>
											</Header.Content>
										</Header>
										<Header inverted={inverted} size="small">
											<Linkify
												properties={{
													target: "_blank"
												}}
											>
												{msg.responses.data[0].response}
											</Linkify>
										</Header>
										<Divider hidden section />
									</>
								)}
							</>
						) : (
							<Placeholder fluid inverted={inverted}>
								<Placeholder.Paragraph>
									<Placeholder.Line length="full" />
									<Placeholder.Line length="long" />
									<Placeholder.Line length="medium" />
								</Placeholder.Paragraph>
								<Placeholder.Paragraph>
									<Placeholder.Line length="very long" />
									<Placeholder.Line length="short" />
								</Placeholder.Paragraph>
							</Placeholder>
						)}
					</Grid.Column>
				</Grid>
			</Segment>

			<Divider hidden section />
		</DefaultLayout>
	)
}

Applications.propTypes = {
	history: PropTypes.object
}

export default Applications

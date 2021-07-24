import { useReducer } from "react"
import logger from "use-reducer-logger"
import ThemeContext from "themeContext"

let auth = localStorage.getItem("auth")
let bearer = localStorage.getItem("bearer")
let inverted = localStorage.getItem("inverted")
let memberCount = localStorage.getItem("memberCount")
let unreadCount = localStorage.getItem("unreadCount")
let user = localStorage.getItem("user")
let verify = localStorage.getItem("verify")

const initialState = {
	auth: auth === null || auth === "false" ? false : true,
	bearer,
	inverted: inverted === null || inverted === "false" ? false : true,
	memberCount,
	unreadCount,
	user: user === null ? {} : JSON.parse(user),
	verify: verify === null || verify === "false" ? false : true
}

const reducer = (state, action) => {
	const { data } = action

	switch (action.type) {
		case "INCREMENT_UNREAD_COUNT":
			return {
				...state,
				unreadCount: state.unreadCount + 1
			}
		case "LOGOUT":
			return {
				...state,
				auth: false,
				bearer: null,
				user: {},
				verify: false
			}
		case "SET_MEMBER_COUNT":
			return {
				...state,
				memberCount: action.count
			}
		case "SET_UNREAD_COUNT":
			return {
				...state,
				unreadCount: action.count
			}
		case "SET_USER_DATA":
			return {
				...state,
				auth: true,
				bearer: data.bearer,
				user: data.user,
				verify: data.verify
			}
		case "TOGGLE_INVERTED":
			return {
				...state,
				inverted: !state.inverted
			}
		case "VERIFY_EMAIL":
			return {
				...state,
				verify: false
			}
		default:
			throw new Error()
	}
}

const ThemeProvider = ({ children }) => {
	const [state, dispatch] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)

	return <ThemeContext.Provider value={{ state, dispatch }}>{children}</ThemeContext.Provider>
}

export default ThemeProvider

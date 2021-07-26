const reducer = (state, action) => {
	switch (action.type) {
		case "MARK_AS_READ":
			const allMessages = state.messages
			allMessages[action.i] = action.message

			return {
				...state,
				messages: allMessages
			}
		case "SET_MESSAGES":
			const messages =
				action.page > 1 ? [...state.messages, ...action.messages] : action.messages
			return {
				...state,
				loaded: true,
				messages
			}
		case "SET_NO_REPLY_COUNT":
			return {
				...state,
				noReplyCount: action.count
			}
		case "SET_RESPONSE":
			const filtered = state.messages
			filtered[action.i] = action.message

			return {
				...state,
				messages: filtered,
				noReplyCount: state.noReplyCount - 1
			}
		default:
			throw new Error()
	}
}

export default reducer

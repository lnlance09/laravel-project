const reducer = (state, action) => {
	switch (action.type) {
		case "GET_COIN":
			return {
				...state,
				coin: action.coin,
				loaded: true
			}
		case "GET_PREDICTIONS":
			const predictions =
				action.page > 1 ? [...state.predictions, ...action.predictions] : action.predictions
			return {
				...state,
				predictions
			}
		case "GET_TRADERS":
			return {
				...state,
				traders: {
					data: action.traders,
					loaded: true
				}
			}
		default:
			throw new Error()
	}
}

export default reducer

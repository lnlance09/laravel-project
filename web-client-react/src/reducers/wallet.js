const reducer = (state, action) => {
	switch (action.type) {
		case "GET_COINS":
			return {
				...state,
				coins: action.data
			}
		case "SET_COIN_DATA":
			return {
				...state,
				coin: {
					explorer: {
						link: action.coin.explorer_link,
						name: action.coin.explorer_name
					},
					externalWallet: {
						link: action.coin.wallet_link,
						name: action.coin.wallet_name
					},
					fork: action.coin.fork,
					forkText: action.coin.fork_text,
					logo: action.coin.logo,
					name: action.coin.name,
					symbol: action.coin.symbol
				}
			}
		default:
			throw new Error()
	}
}

export default reducer

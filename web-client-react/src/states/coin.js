const initialState = {
	coin: {
		category: "",
		circulatingSupply: 0,
		cmcId: 0,
		description: "",
		id: 0,
		lastPrice: "",
		logo: "",
		marketCap: 0,
		maxSupply: 0,
		name: "",
		percentages: {
			"1h": 0,
			"24h": 0,
			"7d": 0,
			"30d": 0,
			"60d": 0,
			"90d": 0
		},
		predictionsCount: 0,
		slug: "",
		symbol: "",
		totalSupply: 0
	},
	loaded: false,
	predictions: [{}, {}, {}, {}, {}, {}],
	traders: {
		data: [{}, {}, {}, {}],
		loaded: false
	}
}

export default initialState

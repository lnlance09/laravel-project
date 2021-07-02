const reducer = (state, action) => {
    switch (action.type) {
        case "GET_COIN":
            return {
                ...state,
                coin: action.coin
            }
        case "GET_LAST_PRICE":
            const { points } = action
            return {
                ...state,
                coin: {
                    ...state.coin,
                    lastPrice: points[points.length - 1][1]
                },
                loaded: true
            }
        default:
            throw new Error()
    }
}

export default reducer

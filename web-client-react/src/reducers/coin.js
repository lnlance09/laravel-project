const reducer = (state, action) => {
    switch (action.type) {
        case "GET_COIN":
            return {
                ...state,
                coin: action.coin,
                loaded: true
            }
        case "GET_LAST_PRICE":
            const { points } = action
            return {
                ...state,
                coin: {
                    ...state.coin,
                    lastPrice: points[points.length - 1][1]
                }
            }
        default:
            throw new Error()
    }
}

export default reducer

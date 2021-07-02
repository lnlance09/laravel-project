const reducer = (state, action) => {
    switch (action.type) {
        case "GET_COINS":
            return {
                ...state,
                coins: action.coins
            }
        default:
            throw new Error()
    }
}

export default reducer

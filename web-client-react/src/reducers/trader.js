const reducer = (state, action) => {
    switch (action.type) {
        case "GET_TRADER":
            return {
                ...state,
                trader: action.trader
            }
        default:
            throw new Error()
    }
}

export default reducer

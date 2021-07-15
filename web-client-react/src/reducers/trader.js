const reducer = (state, action) => {
    switch (action.type) {
        case "GET_PREDICTIONS":
            return {
                ...state,
                predictions: {
                    data: action.predictions,
                    loading: false
                }
            }
        case "GET_TRADER":
            return {
                ...state,
                loaded: true,
                trader: action.trader
            }
        default:
            throw new Error()
    }
}

export default reducer

const reducer = (state, action) => {
    switch (action.type) {
        case "GET_PREDICTIONS":
            const predictions =
                action.page > 1
                    ? [...state.predictions.data, ...action.predictions]
                    : action.predictions
            return {
                ...state,
                predictions: {
                    data: predictions,
                    loading: false
                }
            }
        case "GET_TRADER":
            return {
                ...state,
                loaded: true,
                trader: action.trader
            }
        case "SET_LOADING_PREDICTIONS":
            return {
                ...state,
                predictions: {
                    ...state.predictions,
                    loading: true
                }
            }
        default:
            throw new Error()
    }
}

export default reducer

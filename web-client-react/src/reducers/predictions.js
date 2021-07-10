const reducer = (state, action) => {
    switch (action.type) {
        case "GET_PREDICTIONS":
            return {
                ...state,
                predictions: action.predictions
            }
        default:
            throw new Error()
    }
}

export default reducer

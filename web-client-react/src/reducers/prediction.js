const reducer = (state, action) => {
    switch (action.type) {
        case "GET_PREDICTION":
            return {
                ...state,
                loaded: true,
                prediction: action.prediction
            }
        default:
            throw new Error()
    }
}

export default reducer

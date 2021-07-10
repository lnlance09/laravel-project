const reducer = (state, action) => {
    switch (action.type) {
        case "GET_PREDICTION":
            return {
                ...state,
                prediction: action.prediction
            }
        default:
            throw new Error()
    }
}

export default reducer

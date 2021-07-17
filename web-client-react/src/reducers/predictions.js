const reducer = (state, action) => {
    switch (action.type) {
        case "GET_PREDICTIONS":
            const predictions =
                action.page > 1 ? [...state.predictions, ...action.predictions] : action.predictions
            return {
                ...state,
                predictions
            }
        default:
            throw new Error()
    }
}

export default reducer

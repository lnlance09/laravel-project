const reducer = (state, action) => {
    switch (action.type) {
        case "GET_TRADERS":
            return {
                ...state,
                traders: action.traders
            }
        default:
            throw new Error()
    }
}

export default reducer

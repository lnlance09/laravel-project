const reducer = (state, action) => {
    switch (action.type) {
        case "GET_TRADERS":
            const traders = action.page > 1 ? [...state.traders, ...action.traders] : action.traders
            return {
                ...state,
                traders
            }
        default:
            throw new Error()
    }
}

export default reducer

const reducer = (state, action) => {
    switch (action.type) {
        case "TOGGLE_Y_AXIS":
            return {
                ...state
            }
        default:
            throw new Error()
    }
}

export default reducer

const darkColor = "#1b1c1d"
const lightColor = "#fff"

const reducer = (state, action) => {
    switch (action.type) {
        case "HIDE_X_AXIS":
            return {
                ...state,
                options: {
                    ...state.options,
                    xAxis: {
                        ...state.options.xAxis,
                        labels: {
                            ...state.options.xAxis.labels,
                            enabled: false
                        }
                    }
                }
            }
        case "HIDE_Y_AXIS":
            return {
                ...state,
                options: {
                    ...state.options,
                    yAxis: {
                        ...state.options.yAxis,
                        labels: {
                            ...state.options.yAxis.labels,
                            enabled: false
                        }
                    }
                }
            }
        case "SET_GRAPH_DATA":
            const { points } = action
            return {
                ...state,
                options: {
                    ...state.options,
                    series: [
                        {
                            ...state.options.series[0],
                            data: points
                        }
                    ]
                }
            }
        case "SET_X_AXIS_FORMAT":
            const { duration } = action
            let format = "{value:%a %l %p}"

            if (duration === "1M" || duration === "3M") {
                format = "{value:%b %e}"
            }

            if (duration === "1Y" || duration === "ALL") {
                format = "{value:%b %Y}"
            }

            return {
                ...state,
                options: {
                    ...state.options,
                    xAxis: {
                        ...state.options.xAxis,
                        labels: {
                            ...state.options.xAxis.labels,
                            format
                        }
                    }
                }
            }
        case "TOGGLE_INVERTED":
            const newColor = action.inverted ? darkColor : lightColor

            return {
                ...state,
                options: {
                    ...state.options,
                    chart: {
                        ...state.options.chart,
                        backgroundColor: newColor
                    }
                }
            }
        case "TOGGLE_X_AXIS":
            return {
                ...state,
                options: {
                    ...state.options,
                    xAxis: {
                        ...state.options.xAxis,
                        labels: {
                            ...state.options.xAxis.labels,
                            enabled: !state.options.xAxis.labels.enabled
                        }
                    }
                }
            }
        case "TOGGLE_Y_AXIS":
            return {
                ...state,
                options: {
                    ...state.options,
                    yAxis: {
                        ...state.options.yAxis,
                        labels: {
                            ...state.options.yAxis.labels,
                            enabled: !state.options.yAxis.labels.enabled
                        }
                    }
                }
            }
        default:
            throw new Error()
    }
}

export default reducer

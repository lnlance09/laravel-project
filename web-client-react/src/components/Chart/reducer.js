const darkColor = "#090127"
const lightColor = "#fff"

const darkAreaColor = "#0097e6"
const lightAreaColor = "#3867d6"

const reducer = (state, action) => {
	switch (action.type) {
		case "ADD_SERIES":
			const newSeries = [...state.options.series, action.series]
			return {
				...state,
				options: {
					...state.options,
					series: newSeries
				}
			}
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
		case "SET_COLOR":
			return {
				...state,
				options: {
					...state.options,
					plotOptions: {
						...state.options.plotOptions,
						area: {
							...state.options.plotOptions.area,
							color: action.color
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
							data: points,
							fillOpacity: 0.7,
							turboThreshold: 4000
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
			const newAreaColor = action.inverted ? darkAreaColor : lightAreaColor

			return {
				...state,
				options: {
					...state.options,
					chart: {
						...state.options.chart,
						backgroundColor: newColor
					},
					plotOptions: {
						...state.options.plotOptions,
						area: {
							...state.options.plotOptions.area,
							color: newAreaColor
						}
					}
				}
			}
		default:
			throw new Error()
	}
}

export default reducer

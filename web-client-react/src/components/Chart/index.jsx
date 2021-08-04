import "./style.scss"
import { useEffect, useReducer, useState } from "react"
import { Loader, Menu } from "semantic-ui-react"
import { formatExponent } from "utils/textFunctions"
import axios from "axios"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import initialState from "./state"
import logger from "use-reducer-logger"
import PropTypes from "prop-types"
import reducer from "./reducer"

const red = "#c23616"
const green = "#44bd32"

const Chart = ({
	addSeries = false,
	coin,
	color = null,
	duration = "1D",
	hideXAxis = false,
	hideYAxis = false,
	history,
	includeRanges = true,
	inverted,
	prediction = null,
	startDate = null
}) => {
	const [state, dispatch] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)
	const [loaded, setLoaded] = useState(false)
	const [timeframe, setTimeframe] = useState(duration)

	let predictionPoint = {
		dataLabels: {
			align: "right",
			allowOverlap: true,
			crop: true,
			enabled: true,
			formatter: function () {
				return this.y > 1 ? this.y.toFixed(2) : this.y.toFixed(8)
			},
			overflow: true,
			shadow: false,
			style: {
				color: "white",
				fontFamily: "Overpass",
				fontSize: "16px"
			},
			verticalAlign: "text-top",
			x: 0,
			y: -30
		},
		marker: {
			enabled: true,
			fillColor: inverted ? "#fff" : "#3867d6",
			radius: 4
		}
	}

	useEffect(() => {
		getGraphData(coin.cmcId, timeframe)

		if (hideXAxis) {
			dispatch({
				type: "HIDE_X_AXIS"
			})
		}

		if (hideYAxis) {
			dispatch({
				type: "HIDE_Y_AXIS"
			})
		}

		dispatch({
			type: "TOGGLE_INVERTED",
			inverted
		})

		if (color) {
			dispatch({
				type: "SET_COLOR",
				color
			})
		}

		if (includeRanges && !color) {
			const color = coin.percentages["24h"] > 0 ? green : red
			dispatch({
				type: "SET_COLOR",
				color
			})
		}
		// eslint-disable-next-line
	}, [inverted, prediction])

	const getGraphData = async (id, range) => {
		await axios
			.get(`${process.env.REACT_APP_BASE_URL}coins/graph`, {
				params: {
					id,
					range
				}
			})
			.then(async (response) => {
				const data = response.data
				const points = []
				const series = []

				for (let key in data) {
					const x = key * 1000
					const y = formatExponent(data[key]["v"][0])
					points.push({ x, y })

					if (startDate ? x > startDate * 1000 : false) {
						points.pop()
						points.push({
							...predictionPoint,
							x: startDate * 1000,
							y: prediction.currentPrice
						})

						points.push({ x, y })
						points.push({
							...predictionPoint,
							x: prediction.date * 1000,
							y: prediction.price
						})
						break
					}
				}

				if (!startDate && prediction) {
					points.push({
						...predictionPoint,
						x: prediction.date * 1000,
						y: prediction.price
					})
				}

				if (addSeries) {
					for (let key in data) {
						const x = key * 1000
						const y = formatExponent(data[key]["v"][0])
						if (x > startDate * 1000 && x < prediction.date * 1000) {
							series.push({ x, y })
						}

						if (x > prediction.date * 1000) {
							series.pop()
							series.push({
								...predictionPoint,
								dataLabels: {
									...predictionPoint.dataLabels,
									marker: {
										...predictionPoint.dataLabels.marker,
										fillColor: "#fff"
									},
									x: 0,
									y: 10
								},
								x,
								y
							})
							break
						}
					}
				}

				dispatch({
					type: "SET_GRAPH_DATA",
					points
				})

				if (addSeries) {
					dispatch({
						type: "ADD_SERIES",
						series: {
							color: "#26de81",
							data: series,
							fillOpacity: 0.7,
							turboThreshold: 4000
						}
					})
				}

				dispatch({
					type: "SET_X_AXIS_FORMAT",
					duration: range
				})

				setLoaded(true)
			})
			.catch((error) => {
				console.error(error)
			})
	}

	const handleTimeChange = (e, { name }) => {
		setTimeframe(name)
		getGraphData(coin.cmcId, name)

		let color = green
		if (name === "1D") {
			color = coin.percentages["24h"] > 0 ? green : red
		}

		if (name === "7D") {
			color = coin.percentages["7d"] > 0 ? green : red
		}

		if (name === "1M") {
			color = coin.percentages["30d"] > 0 ? green : red
		}

		if (name === "3M") {
			color = coin.percentages["90d"] > 0 ? green : red
		}

		dispatch({
			type: "SET_COLOR",
			color
		})
	}

	return (
		<div className="chartComponent">
			{includeRanges && (
				<Menu inverted={inverted} secondary>
					{state.timeframes.map((item) => (
						<Menu.Item
							active={timeframe === item.name}
							name={item.name}
							key={item.name}
							onClick={handleTimeChange}
						/>
					))}
				</Menu>
			)}

			{loaded ? (
				<HighchartsReact
					allowChartUpdate
					containerProps={{ className: "chartContainer" }}
					highcharts={Highcharts}
					inverted={inverted}
					options={state.options}
				/>
			) : (
				<div className="centeredLoader">
					<Loader active inverted={inverted} size="big" />
				</div>
			)}
		</div>
	)
}

Chart.propTypes = {
	addSeries: PropTypes.bool,
	coin: PropTypes.shape({
		category: PropTypes.string,
		circulatingSupply: PropTypes.number,
		cmcId: PropTypes.number,
		description: PropTypes.string,
		id: PropTypes.number,
		lastPrice: PropTypes.number,
		logo: PropTypes.string,
		marketCap: PropTypes.number,
		maxSupply: PropTypes.number,
		name: PropTypes.string,
		percentages: PropTypes.shape({
			"1h": PropTypes.number,
			"24h": PropTypes.number,
			"7d": PropTypes.number,
			"30d": PropTypes.number,
			"60d": PropTypes.number,
			"90d": PropTypes.number
		}),
		predictionsCount: PropTypes.number,
		slug: PropTypes.string,
		symbol: PropTypes.string,
		totalSupply: PropTypes.number
	}),
	color: PropTypes.string,
	hideXAxis: PropTypes.bool,
	hideYAxis: PropTypes.bool,
	history: PropTypes.object,
	includeRanges: PropTypes.bool,
	inverted: PropTypes.bool,
	prediction: PropTypes.shape({
		currentPrice: PropTypes.number,
		date: PropTypes.number,
		price: PropTypes.number
	}),
	startDate: PropTypes.number
}

export default Chart

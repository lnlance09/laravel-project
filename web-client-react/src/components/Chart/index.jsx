import "./style.scss"
import { useEffect, useReducer, useState } from "react"
import { Menu, Segment } from "semantic-ui-react"
import axios from "axios"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import initialState from "./state"
import logger from "use-reducer-logger"
import PropTypes from "prop-types"
import reducer from "./reducer"

const Chart = ({
    coin,
    duration = "1D",
    hideXAxis = false,
    hideYAxis = false,
    history,
    includeRanges = true,
    inverted,
    period = 300,
    prediction = null,
    start = Math.round(new Date().getTime() / 1000 - 3600 * 24)
}) => {
    const [state, dispatch] = useReducer(
        process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
        initialState
    )
    const [loaded, setLoaded] = useState(false)
    const [timeframe, setTimeframe] = useState(duration)

    useEffect(() => {
        getGraphData({ coin: coin.symbol, duration, period, prediction, start })

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
    }, [inverted, prediction])

    const getGraphData = async ({ coin, duration, period, prediction = null, start }) => {
        return await axios
            .get("https://poloniex.com/public", {
                params: {
                    command: "returnChartData",
                    currencyPair: `USDT_${coin}`,
                    end: "9999999999999999",
                    start,
                    period
                }
            })
            .then((response) => {
                const { data } = response
                const points = []
                for (let i in data) {
                    points.push([data[i]["date"] * 1000, data[i].weightedAverage])
                }

                if (prediction) {
                    points.push([prediction.date, prediction.price])
                }

                dispatch({
                    type: "SET_GRAPH_DATA",
                    points
                })

                dispatch({
                    type: "SET_X_AXIS_FORMAT",
                    duration
                })

                setLoaded(true)
            })
            .catch(() => {
                console.error("There was an error")
            })
    }

    const handleTimeChange = async (e, { name }) => {
        setTimeframe(name)
        const timeframe = await state.timeframes.filter((t) => t.name === name)
        const { period, start } = timeframe[0]
        getGraphData({ coin: coin.symbol, duration: name, period, start })
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

            <HighchartsReact
                allowChartUpdate
                containerProps={{ className: "chartContainer" }}
                highcharts={Highcharts}
                inverted={inverted}
                options={state.options}
            />
        </div>
    )
}

Chart.propTypes = {
    coin: PropTypes.shape({
        category: PropTypes.string,
        circulatingSupply: PropTypes.number,
        dailyPercentChange: PropTypes.number,
        description: PropTypes.string,
        id: PropTypes.number,
        lastPrice: PropTypes.number,
        logo: PropTypes.string,
        marketCap: PropTypes.number,
        maxSupply: PropTypes.number,
        name: PropTypes.string.isRequired,
        slug: PropTypes.string,
        symbol: PropTypes.string,
        totalSupply: PropTypes.number
    }),
    hideXAxis: PropTypes.bool,
    hideYAxis: PropTypes.bool,
    includeRanges: PropTypes.bool,
    inverted: PropTypes.bool,
    options: PropTypes.shape({}),
    prediction: PropTypes.shape({
        date: PropTypes.number,
        price: PropTypes.number
    }),
    timeframes: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            period: PropTypes.number,
            start: PropTypes.number
        })
    )
}

export default Chart

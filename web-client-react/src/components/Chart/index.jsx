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
    hideXAxis = false,
    hideYAxis = false,
    history,
    includeRanges = true,
    period = 300,
    start = Math.round(new Date().getTime() / 1000 - 3600 * 24)
}) => {
    const [state, dispatch] = useReducer(
        process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
        initialState
    )
    const [loaded, setLoaded] = useState(false)
    const [timeframe, setTimeframe] = useState("1D")

    useEffect(() => {
        getGraphData({ coin: coin.symbol, duration: "1D", period, start })

        if (hideXAxis) {
            dispatch({
                type: "TOGGLE_X_AXIS"
            })
        }

        if (hideYAxis) {
            dispatch({
                type: "TOGGLE_Y_AXIS"
            })
        }
    }, [])

    const getGraphData = async ({ coin, duration, period, start }) => {
        return await axios
            .get(
                `https://poloniex.com/public?command=returnChartData&currencyPair=USDT_${coin}&start=${start}&end=9999999999999999&period=${period}`
            )
            .then((response) => {
                const { data } = response
                const points = []
                for (let i in data) {
                    points.push([data[i]["date"] * 1000, data[i].weightedAverage])
                }

                dispatch({
                    type: "GET_GRAPH_DATA",
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
        <div className="chart-component">
            {includeRanges && (
                <Menu attached="top" tabular>
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
            <Segment attached={includeRanges ? "bottom" : false}>
                <HighchartsReact
                    allowChartUpdate
                    containerProps={{ className: "chartContainer" }}
                    highcharts={Highcharts}
                    options={state.options}
                />
            </Segment>
        </div>
    )
}

Chart.propTypes = {
    coin: PropTypes.shape({
        category: PropTypes.string,
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
    options: PropTypes.shape({}),
    timeframes: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            period: PropTypes.number,
            start: PropTypes.number
        })
    )
}

export default Chart

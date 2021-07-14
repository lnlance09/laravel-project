import "./style.scss"
import { useEffect, useReducer, useState } from "react"
import { Loader, Menu } from "semantic-ui-react"
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
    }, [inverted, prediction])

    const getGraphData = async (id, range) => {
        await axios
            .get("https://api.coinmarketcap.com/data-api/v3/cryptocurrency/detail/chart", {
                params: {
                    id,
                    range
                }
            })
            .then((response) => {
                const { data } = response.data
                const points = []
                for (let key in data.points) {
                    points.push([key * 1000, data.points[key]["v"][0]])
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
                    duration: range
                })

                setLoaded(true)
            })
            .catch(() => {
                console.error("There was an error")
            })
    }

    const handleTimeChange = (e, { name }) => {
        setTimeframe(name)
        getGraphData(coin.cmcId, name)
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
                <>
                    <div className="centered">
                        <Loader active inverted={inverted} size="big" />
                    </div>
                </>
            )}
        </div>
    )
}

Chart.propTypes = {
    coin: PropTypes.shape({
        category: PropTypes.string,
        circulatingSupply: PropTypes.number,
        cmcId: PropTypes.number,
        dailyPercentChange: PropTypes.string,
        description: PropTypes.string,
        id: PropTypes.number,
        lastPrice: PropTypes.number,
        logo: PropTypes.string,
        marketCap: PropTypes.number,
        maxSupply: PropTypes.number,
        name: PropTypes.string.isRequired,
        predictionsCount: PropTypes.number,
        slug: PropTypes.string,
        symbol: PropTypes.string,
        totalSupply: PropTypes.number
    }),
    hideXAxis: PropTypes.bool,
    hideYAxis: PropTypes.bool,
    history: PropTypes.object,
    includeRanges: PropTypes.bool,
    inverted: PropTypes.bool,
    prediction: PropTypes.shape({
        date: PropTypes.number,
        price: PropTypes.number
    })
}

export default Chart

import { Divider, Header, Image, Loader, Segment } from "semantic-ui-react"
import { useContext, useEffect, useReducer, useState } from "react"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import axios from "axios"
import Chart from "components/Chart"
import DefaultLayout from "layouts/default"
import initialState from "states/coin"
import logger from "use-reducer-logger"
import NumberFormat from "react-number-format"
import PredictionForm from "components/PredictionForm"
import PropTypes from "prop-types"
import reducer from "reducers/coin"
import ThemeContext from "themeContext"

const toastConfig = getConfig()
toast.configure(toastConfig)

const Coin = ({ history, match }) => {
    const { inverted } = useContext(ThemeContext)
    const { slug } = match.params
    const [state, dispatch] = useReducer(
        process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
        initialState
    )

    useEffect(() => {
        const getCoin = async (slug, callback) => {
            return await axios
                .get(`http://localhost/api/coins/${slug}`)
                .then(async (response) => {
                    const coin = response.data.data
                    dispatch({
                        type: "GET_COIN",
                        coin
                    })
                    await callback(coin.symbol)
                })
                .catch(() => {
                    toast.error("There was an error")
                })
        }

        getCoin(slug, getLastPrice)
    }, [slug])

    const getLastPrice = async (coin) => {
        const start = Math.round(new Date().getTime() / 1000 - 86400)
        return await axios
            .get("https://poloniex.com/public", {
                params: {
                    command: "returnChartData",
                    currencyPair: `USDT_${coin}`,
                    end: "9999999999999999",
                    start,
                    period: 300
                }
            })
            .then((response) => {
                const { data } = response
                const points = []
                for (let i in data) {
                    points.push([data[i]["date"] * 1000, data[i].weightedAverage])
                }

                dispatch({
                    type: "GET_LAST_PRICE",
                    points
                })
            })
            .catch(() => {
                console.error("There was an error")
            })
    }

    return (
        <DefaultLayout history={history} inverted={inverted} textAlign="center" useGrid={false}>
            {state.loaded ? (
                <>
                    <Header as="h1" inverted={inverted}>
                        <Image circular size="huge" src={state.coin.logo} />
                        <Header.Content>
                            {state.coin.name}
                            <Header.Subheader>
                                <NumberFormat
                                    decimalScale={2}
                                    displayType={"text"}
                                    prefix={"$"}
                                    thousandSeparator
                                    value={state.coin.lastPrice}
                                />
                            </Header.Subheader>
                        </Header.Content>
                    </Header>
                    <Chart coin={state.coin} inverted={inverted} />
                    <Divider
                        className="makePredictionDivider"
                        horizontal
                        inverted={inverted}
                        section
                    >
                        <Header as="h2" className="dividerHeader" inverted={inverted}>
                            Make a Prediction
                        </Header>
                    </Divider>
                    <Segment basic inverted={inverted}>
                        <PredictionForm
                            coin={state.coin}
                            defaultPrice={state.coin.lastPrice * 1.1}
                            history={history}
                            inverted={inverted}
                        />
                    </Segment>
                    <Divider inverted={inverted} section />
                </>
            ) : (
                <>
                    <div className="centered">
                        <Loader active inverted={inverted} size="big" />
                    </div>
                </>
            )}
        </DefaultLayout>
    )
}

Coin.propTypes = {
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
    })
}

export default Coin

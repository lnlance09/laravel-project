import { Divider, Grid, Header, Image, List, Loader, Segment } from "semantic-ui-react"
import { useContext, useEffect, useReducer } from "react"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import axios from "axios"
import Chart from "components/Chart"
import DefaultLayout from "layouts/default"
import initialState from "states/coin"
import Linkify from "react-linkify"
import logger from "use-reducer-logger"
import NumberFormat from "react-number-format"
import PredictionForm from "components/PredictionForm"
import PropTypes from "prop-types"
import reducer from "reducers/coin"
import ThemeContext from "themeContext"

const toastConfig = getConfig()
toast.configure(toastConfig)

const Coin = ({ history, match }) => {
    const { state } = useContext(ThemeContext)
    const { inverted } = state
    const { slug } = match.params
    const [internalState, dispatch] = useReducer(
        process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
        initialState
    )
    const { coin, loaded } = internalState

    useEffect(() => {
        const getCoin = async (slug, callback) => {
            await axios
                .get(`${process.env.REACT_APP_BASE_URL}coins/${slug}`)
                .then(async (response) => {
                    const coin = response.data.data
                    dispatch({
                        type: "GET_COIN",
                        coin
                    })
                    await callback(coin.cmcId)
                })
                .catch(() => {
                    toast.error("There was an error")
                })
        }

        getCoin(slug, getLastPrice)
    }, [slug])

    const getLastPrice = async (id) => {
        await axios
            .get("https://api.coinmarketcap.com/data-api/v3/cryptocurrency/detail/chart", {
                params: {
                    id,
                    range: "1D"
                }
            })
            .then((response) => {
                const { data } = response.data
                const points = []
                for (let key in data.points) {
                    points.push([key * 1000, data.points[key]["v"][0]])
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
            {loaded ? (
                <>
                    <Header as="h1" inverted={inverted}>
                        <Image circular size="huge" src={coin.logo} />
                        <Header.Content>
                            {coin.name}
                            <Header.Subheader>
                                <NumberFormat
                                    decimalScale={2}
                                    displayType={"text"}
                                    prefix={"$"}
                                    thousandSeparator
                                    value={coin.lastPrice}
                                />
                            </Header.Subheader>
                        </Header.Content>
                    </Header>
                    <Header as="p" inverted={inverted}>
                        <Linkify
                            properties={{
                                target: "_blank"
                            }}
                        >
                            {coin.description}
                        </Linkify>
                    </Header>

                    <Header
                        as="h2"
                        className="dividerHeader"
                        dividing
                        inverted={inverted}
                        size="huge"
                    >
                        Metrics
                    </Header>

                    <Segment inverted={inverted}>
                        <Grid columns={2} stackable>
                            <Grid.Row>
                                <Grid.Column>
                                    <List size="big">
                                        <List.Item>
                                            <b>Market Cap:</b>{" "}
                                            <NumberFormat
                                                decimalScale={2}
                                                displayType={"text"}
                                                prefix={"$"}
                                                thousandSeparator
                                                value={coin.marketCap}
                                            />
                                        </List.Item>
                                        <List.Item>
                                            <b>Circ Supply:</b>{" "}
                                            <NumberFormat
                                                displayType={"text"}
                                                thousandSeparator
                                                value={coin.circulatingSupply}
                                            />
                                        </List.Item>
                                        <List.Item>
                                            <b>Max Supply:</b>{" "}
                                            <NumberFormat
                                                displayType={"text"}
                                                thousandSeparator
                                                value={coin.maxSupply}
                                            />
                                        </List.Item>
                                    </List>
                                </Grid.Column>
                                <Grid.Column></Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Segment>

                    <Header
                        as="h2"
                        className="dividerHeader"
                        dividing
                        inverted={inverted}
                        size="huge"
                    >
                        Performance
                    </Header>

                    <Chart coin={coin} inverted={inverted} />

                    <Header
                        as="h2"
                        className="dividerHeader"
                        dividing
                        inverted={inverted}
                        size="huge"
                    >
                        Make a Prediction
                    </Header>

                    <PredictionForm
                        coin={coin}
                        defaultPrice={coin.lastPrice * 1.1}
                        history={history}
                        inverted={inverted}
                    />

                    <Header
                        as="h2"
                        className="dividerHeader"
                        dividing
                        inverted={inverted}
                        size="huge"
                    >
                        Best {coin.symbol} Traders
                    </Header>

                    <Divider hidden section />
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
        circulatingSupply: PropTypes.number,
        dailyPercentChange: PropTypes.string,
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

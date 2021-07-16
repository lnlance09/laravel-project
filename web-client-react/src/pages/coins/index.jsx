import {
    Divider,
    Grid,
    Header,
    Image,
    Loader,
    Placeholder,
    Segment,
    Statistic
} from "semantic-ui-react"
import { useContext, useEffect, useReducer } from "react"
import { DisplayMetaTags } from "utils/metaFunctions"
import { formatNumber } from "utils/textFunctions"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import axios from "axios"
import Chart from "components/Chart"
import DefaultLayout from "layouts/default"
import initialState from "states/coin"
import Linkify from "react-linkify"
import logger from "use-reducer-logger"
import NumberFormat from "react-number-format"
import PlaceholderPic from "images/images/image-square.png"
import PredictionForm from "components/PredictionForm"
import PropTypes from "prop-types"
import ReactTooltip from "react-tooltip"
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
    const { coin, loaded, traders } = internalState

    useEffect(() => {
        const getCoin = async (slug) => {
            await axios
                .get(`${process.env.REACT_APP_BASE_URL}coins/${slug}`)
                .then(async (response) => {
                    const coin = response.data.data
                    dispatch({
                        type: "GET_COIN",
                        coin
                    })
                    getTraders(coin.id)
                })
                .catch(() => {
                    toast.error("There was an error")
                })
        }

        getCoin(slug)
    }, [slug])

    const getTraders = async (id) => {
        await axios
            .get(`${process.env.REACT_APP_BASE_URL}coins/topTraders`, {
                params: {
                    coinId: id
                }
            })
            .then((response) => {
                const { data } = response.data
                dispatch({
                    type: "GET_TRADERS",
                    traders: data
                })
            })
            .catch(() => {
                console.error("Last price could not be fetched")
            })
    }

    return (
        <DefaultLayout
            activeItem="coins"
            containerClassName="coinPage"
            history={history}
            inverted={inverted}
            textAlign="center"
            useGrid={false}
        >
            <DisplayMetaTags page="coin" state={internalState} />
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

                    <Header as="h2" className="dividerHeader" inverted={inverted} size="huge">
                        Metrics
                    </Header>

                    <Grid className="metricsGrid" padded="vertically" stackable textAlign="center">
                        <Grid.Row columns={5}>
                            <Grid.Column>
                                <Statistic color="orange" inverted={inverted}>
                                    <Statistic.Value>
                                        {formatNumber(coin.marketCap)}
                                    </Statistic.Value>
                                    <Statistic.Label>Market Cap</Statistic.Label>
                                </Statistic>
                            </Grid.Column>
                            <Grid.Column>
                                <Statistic color="blue" inverted={inverted}>
                                    <Statistic.Value>
                                        {formatNumber(coin.volume24h)}
                                    </Statistic.Value>
                                    <Statistic.Label>24H Volume</Statistic.Label>
                                </Statistic>
                            </Grid.Column>
                            <Grid.Column>
                                <Statistic color="yellow" inverted={inverted}>
                                    <Statistic.Value>
                                        {formatNumber(coin.circulatingSupply)}
                                    </Statistic.Value>
                                    <Statistic.Label>Circ Supply</Statistic.Label>
                                </Statistic>
                            </Grid.Column>
                            <Grid.Column>
                                <Statistic color="teal" inverted={inverted}>
                                    <Statistic.Value>
                                        {formatNumber(coin.totalSupply)}
                                    </Statistic.Value>
                                    <Statistic.Label>Total Supply</Statistic.Label>
                                </Statistic>
                            </Grid.Column>
                            <Grid.Column>
                                <Statistic color="violet" inverted={inverted}>
                                    <Statistic.Value>
                                        {formatNumber(coin.maxSupply)}
                                    </Statistic.Value>
                                    <Statistic.Label>Max Supply</Statistic.Label>
                                </Statistic>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={4}>
                            <Grid.Column>
                                <Statistic
                                    color={coin.percentages["1h"] > 0 ? "green" : "red"}
                                    inverted={inverted}
                                >
                                    <Statistic.Value>
                                        {coin.percentages["1h"] > 0 ? "+" : null}
                                        {coin.percentages["1h"]}%
                                    </Statistic.Value>
                                    <Statistic.Label>1H Change</Statistic.Label>
                                </Statistic>
                            </Grid.Column>
                            <Grid.Column>
                                <Statistic
                                    color={coin.percentages["24h"] > 0 ? "green" : "red"}
                                    inverted={inverted}
                                >
                                    <Statistic.Value>
                                        {coin.percentages["24h"] > 0 ? "+" : null}
                                        {coin.percentages["24h"]}%
                                    </Statistic.Value>
                                    <Statistic.Label>24H Change</Statistic.Label>
                                </Statistic>
                            </Grid.Column>
                            <Grid.Column>
                                <Statistic
                                    color={coin.percentages["7d"] > 0 ? "green" : "red"}
                                    inverted={inverted}
                                >
                                    <Statistic.Value>
                                        {coin.percentages["7d"] > 0 ? "+" : null}
                                        {coin.percentages["7d"]}%
                                    </Statistic.Value>
                                    <Statistic.Label>7D Change</Statistic.Label>
                                </Statistic>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={3}>
                            <Grid.Column>
                                <Statistic
                                    color={coin.percentages["30d"] > 0 ? "green" : "red"}
                                    inverted={inverted}
                                >
                                    <Statistic.Value>
                                        {coin.percentages["30d"] > 0 ? "+" : null}
                                        {coin.percentages["30d"]}%
                                    </Statistic.Value>
                                    <Statistic.Label>30D Change</Statistic.Label>
                                </Statistic>
                            </Grid.Column>
                            <Grid.Column>
                                <Statistic
                                    color={coin.percentages["60d"] > 0 ? "green" : "red"}
                                    inverted={inverted}
                                >
                                    <Statistic.Value>
                                        {coin.percentages["60d"] > 0 ? "+" : null}
                                        {coin.percentages["60d"]}%
                                    </Statistic.Value>
                                    <Statistic.Label>60D Change</Statistic.Label>
                                </Statistic>
                            </Grid.Column>
                            <Grid.Column>
                                <Statistic
                                    color={coin.percentages["90d"] > 0 ? "green" : "red"}
                                    inverted={inverted}
                                >
                                    <Statistic.Value>
                                        {coin.percentages["90d"] > 0 ? "+" : null}
                                        {coin.percentages["90d"]}%
                                    </Statistic.Value>
                                    <Statistic.Label>90D Change</Statistic.Label>
                                </Statistic>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>

                    <Header as="h2" className="dividerHeader" inverted={inverted} size="huge">
                        Performance
                    </Header>

                    <Chart coin={coin} inverted={inverted} />

                    <Header as="h2" className="dividerHeader" inverted={inverted} size="huge">
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
                        inverted={inverted}
                        size="huge"
                        textAlign="center"
                    >
                        Best {coin.symbol} Traders
                    </Header>

                    {traders.data.length > 0 && traders.loaded ? (
                        <Grid columns="equal">
                            {traders.data.map((trader, i) => {
                                let accuracy = 0
                                let tooltip = ""

                                if (traders.loaded) {
                                    accuracy = trader.accuracy.toFixed(2)
                                    tooltip = `
                                <div>
                                    <h3 style="margin-bottom: 2px;">${trader.name}</h3>
                                    <p class="header">${accuracy}% accurate with ${coin.name}</p>
                                </div>`
                                }

                                return (
                                    <Grid.Column key={`topTrader${i}`} width={2}>
                                        {!traders.loaded ? (
                                            <>
                                                <Placeholder inverted={inverted} fluid>
                                                    <Placeholder.Image />
                                                </Placeholder>
                                            </>
                                        ) : (
                                            <>
                                                <Image
                                                    centered
                                                    circular
                                                    className="topTraderImg"
                                                    data-for={`topTrader${i}`}
                                                    data-tip={tooltip}
                                                    data-iscapture="true"
                                                    onClick={() =>
                                                        history.push(`/${trader.username}`)
                                                    }
                                                    onError={(i) => (i.target.src = PlaceholderPic)}
                                                    src={trader.img}
                                                />
                                                <ReactTooltip
                                                    html={true}
                                                    id={`topTrader${i}`}
                                                    place="right"
                                                    type="dark"
                                                />
                                            </>
                                        )}
                                    </Grid.Column>
                                )
                            })}
                        </Grid>
                    ) : (
                        <Segment inverted={inverted} placeholder>
                            <Header
                                content="No predictions yet..."
                                inverted={inverted}
                                size="large"
                                textAlign="center"
                            />
                        </Segment>
                    )}

                    <Divider hidden section />
                </>
            ) : (
                <>
                    <div className="centeredLoader">
                        <Loader active inverted={inverted} size="big" />
                    </div>
                </>
            )}
        </DefaultLayout>
    )
}

Coin.propTypes = {
    history: PropTypes.object,
    match: PropTypes.object
}

export default Coin

import { Button, Divider, Grid, Header } from "semantic-ui-react"
import { useContext, useEffect, useReducer, useState } from "react"
import { DebounceInput } from "react-debounce-input"
import { DisplayMetaTags } from "utils/metaFunctions"
import { getConfig } from "options/toast"
import { setIcon } from "utils/textFunctions"
import { toast } from "react-toastify"
import axios from "axios"
import CoinList from "components/CoinList/"
import DefaultLayout from "layouts/default"
import initialState from "states/coins"
import logger from "use-reducer-logger"
import reducer from "reducers/coins"
import PropTypes from "prop-types"
import ThemeContext from "themeContext"

const toastConfig = getConfig()
toast.configure(toastConfig)

const Coins = ({ history }) => {
    const { state } = useContext(ThemeContext)
    const { inverted } = state

    const [internalState, dispatch] = useReducer(
        process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
        initialState
    )
    const [activeItem, setActiveItem] = useState(null)
    const [direction, setDirection] = useState(null)
    const [loading, setLoading] = useState(false)
    const [marketCap, setMarketCap] = useState(null)
    const [predictions, setPredictions] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        getCoins(null, null, null)
    }, [])

    const getCoins = async (q, sort, dir) => {
        setLoading(true)
        await axios
            .get(`${process.env.REACT_APP_BASE_URL}coins`, {
                params: {
                    q,
                    sort,
                    dir
                }
            })
            .then((response) => {
                const coins = response.data.data
                dispatch({
                    type: "GET_COINS",
                    coins
                })
                setLoading(false)
            })
            .catch(() => {
                toast.error("There was an error")
            })
    }

    const onChangeText = async (e) => {
        const q = e.target.value
        setSearchTerm(q)
        await getCoins(q, activeItem, direction)
    }

    const onClickCoin = (slug) => {
        history.push(`/coins/${slug}`)
    }

    const toggleMarketCap = () => {
        const newVal = marketCap === null || marketCap === "desc" ? "asc" : "desc"
        setMarketCap(newVal)
        setActiveItem("market_cap")
        setDirection(newVal)
        getCoins(searchTerm, "market_cap", newVal)
    }

    const togglePredictions = () => {
        const newVal = predictions === null || predictions === "desc" ? "asc" : "desc"
        setPredictions(newVal)
        setActiveItem("predictions_count")
        setDirection(newVal)
        getCoins(searchTerm, "predictions_count", newVal)
    }

    return (
        <DefaultLayout
            activeItem="coins"
            containerClassName="coinsPage"
            history={history}
            inverted={inverted}
            useGrid={false}
        >
            <DisplayMetaTags page="coins" state={internalState} />
            <Header as="h1" className="massive" inverted={inverted}>
                Browse coins
            </Header>
            <Grid>
                <Grid.Column width={10}>
                    <div className={`ui icon input big basic fluid ${inverted ? "inverted" : ""}`}>
                        <DebounceInput
                            debounceTimeout={400}
                            minLength={2}
                            onChange={onChangeText}
                            placeholder="Search..."
                            value={searchTerm}
                        />
                    </div>
                </Grid.Column>
                <Grid.Column width={3}>
                    <Button
                        color="blue"
                        content="Predictions"
                        fluid
                        icon={activeItem === "predictions_count" && setIcon(predictions)}
                        inverted={inverted}
                        onClick={togglePredictions}
                        size="big"
                    />
                </Grid.Column>
                <Grid.Column width={3}>
                    <Button
                        color="violet"
                        content="Market Cap"
                        fluid
                        icon={activeItem === "market_cap" && setIcon(marketCap)}
                        inverted={inverted}
                        onClick={toggleMarketCap}
                        size="big"
                    />
                </Grid.Column>
            </Grid>
            <Divider hidden />
            <CoinList
                coins={internalState.coins}
                inverted={inverted}
                loading={loading}
                onClickCoin={onClickCoin}
            />
            <Divider hidden />
        </DefaultLayout>
    )
}

Coins.propTypes = {
    history: PropTypes.object
}

export default Coins

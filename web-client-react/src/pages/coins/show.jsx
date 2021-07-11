import { Button, Divider, Dropdown, Grid, Header } from "semantic-ui-react"
import { useContext, useEffect, useReducer, useState } from "react"
import { DebounceInput } from "react-debounce-input"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import axios from "axios"
import CoinList from "components/CoinList/"
import DefaultLayout from "layouts/default"
import initialState from "states/coins"
import logger from "use-reducer-logger"
import reducer from "reducers/coins"
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
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        getCoins(searchTerm)
    }, [searchTerm])

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

    const onChangeMarketCap = (e, { value }) => {
        getCoins(searchTerm, "market_cap", value)
    }

    const onChangePredictions = (e, { value }) => {
        getCoins(searchTerm, "predictions_count", value)
    }

    const onChangeText = async (e) => {
        const q = e.target.value
        setSearchTerm(q)
        await getCoins(q)
    }

    const onClickCoin = (slug) => {
        history.push(`/coins/${slug}`)
    }

    return (
        <DefaultLayout history={history} inverted={inverted} useGrid={false}>
            <Header as="h1" inverted={inverted}>
                Browse coins
            </Header>
            <Grid>
                <Grid.Column width={10}>
                    <div className={`ui icon input big basic fluid ${inverted ? "inverted" : ""}`}>
                        <DebounceInput
                            debounceTimeout={700}
                            minLength={2}
                            onChange={onChangeText}
                            placeholder="Search..."
                            value={searchTerm}
                        />
                    </div>
                </Grid.Column>
                <Grid.Column width={3}>
                    <Dropdown
                        className="inverted"
                        fluid
                        icon={false}
                        onChange={onChangePredictions}
                        options={[
                            { icon: "arrow up green", key: "most", text: "Most", value: "desc" },
                            {
                                icon: "arrow down red",
                                key: "fewest",
                                text: "Fewest",
                                value: "asc"
                            }
                        ]}
                        trigger={
                            <Button
                                color="blue"
                                content="Predictions"
                                fluid
                                inverted={inverted}
                                size="big"
                            />
                        }
                    />
                </Grid.Column>
                <Grid.Column width={3}>
                    <Dropdown
                        className="inverted"
                        fluid
                        icon={false}
                        onChange={onChangeMarketCap}
                        options={[
                            {
                                icon: "arrow up green",
                                key: "highest",
                                text: "Highest",
                                value: "desc"
                            },
                            {
                                icon: "arrow down red",
                                key: "lowest",
                                text: "Lowest",
                                value: "asc"
                            }
                        ]}
                        trigger={
                            <Button
                                color="violet"
                                content="Market Cap"
                                fluid
                                inverted={inverted}
                                size="big"
                            />
                        }
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
        </DefaultLayout>
    )
}

export default Coins

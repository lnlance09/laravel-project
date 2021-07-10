import { Divider, Grid, Header, Segment } from "semantic-ui-react"
import { useContext, useEffect, useReducer, useState } from "react"
import { DebounceInput } from "react-debounce-input"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import axios from "axios"
import CoinList from "components/CoinList/"
import DefaultLayout from "layouts/default"
import initialState from "states/traders"
import logger from "use-reducer-logger"
import reducer from "reducers/traders"
import ThemeContext from "themeContext"

const toastConfig = getConfig()
toast.configure(toastConfig)

const Traders = ({ history }) => {
    const { state } = useContext(ThemeContext)
    const { inverted } = state
    const [internalState, dispatch] = useReducer(
        process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
        initialState
    )
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        getCoins(searchTerm)
    }, [])

    const getCoins = async (q) => {
        const headers = {
            "Content-Type": "application/json"
        }
        return await axios
            .get(
                `${process.env.REACT_APP_BASE_URL}coins`,
                {
                    params: {
                        q
                    }
                },
                {
                    headers
                }
            )
            .then((response) => {
                const coins = response.data.data
                dispatch({
                    type: "GET_COINS",
                    coins
                })
            })
            .catch(() => {
                toast.error("There was an error")
            })
    }

    const onChangeText = async (e) => {
        const q = e.target.value
        setSearchTerm(q)
        await getCoins(q)
    }

    const onClickCoin = (coin) => {
        history.push(`/coins/${coin.slug}`)
    }

    return (
        <DefaultLayout history={history} inverted={inverted} useGrid={false}>
            <Header as="h1" inverted={inverted}>
                Traders
            </Header>
            <div className={`ui icon input big fluid ${inverted ? "inverted" : ""}`}>
                <DebounceInput
                    debounceTimeout={700}
                    minLength={2}
                    onChange={onChangeText}
                    placeholder="Search..."
                    value={searchTerm}
                />
            </div>
            <Divider hidden />
            <CoinList coins={internalState.coins} inverted={inverted} onClickCoin={onClickCoin} />
        </DefaultLayout>
    )
}

export default Traders

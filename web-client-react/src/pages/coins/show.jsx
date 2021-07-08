import { Divider, Header, Segment } from "semantic-ui-react"
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
    const { inverted } = useContext(ThemeContext)
    const [state, dispatch] = useReducer(
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
            <Segment basic className="searchSegment" inverted={inverted}>
                <Header as="h1" inverted={inverted}>
                    Find a coin
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
            </Segment>
            <Segment inverted={inverted} stacked>
                <CoinList coins={state.coins} inverted={inverted} onClickCoin={onClickCoin} />
            </Segment>
            <Divider inverted={inverted} section />
        </DefaultLayout>
    )
}

export default Coins

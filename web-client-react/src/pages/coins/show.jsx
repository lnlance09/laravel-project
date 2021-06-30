import { Divider, Header, Segment } from "semantic-ui-react"
import { useEffect, useReducer, useState } from "react"
import { DebounceInput } from "react-debounce-input"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import axios from "axios"
import CoinList from "components/CoinList/"
import DefaultLayout from "layouts/default"

const toastConfig = getConfig()
toast.configure(toastConfig)

const initialState = { coins: [{}, {}, {}] }

function reducer(state, action) {
    switch (action.type) {
        case "GET_COINS":
            return { coins: action.coins }
        default:
            return state
    }
}

const Coins = ({ history }) => {
    const [state, dispatch] = useReducer(reducer, initialState)
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
                "http://localhost/api/coins",
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
        <DefaultLayout textAlign="center" useGrid={false}>
            <Segment basic className="searchContainer">
                <Header as="h1">Find a coin</Header>
                <div className="ui icon input big fluid">
                    <DebounceInput
                        debounceTimeout={700}
                        minLength={2}
                        onChange={onChangeText}
                        placeholder="Search..."
                        value={searchTerm}
                    />
                </div>
            </Segment>
            <Segment stacked>
                <CoinList coins={state.coins} onClickCoin={onClickCoin} />
            </Segment>
            <Divider section />
        </DefaultLayout>
    )
}

export default Coins

import { Divider, Header, Loader, Segment } from "semantic-ui-react"
import { useContext, useEffect, useReducer } from "react"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import axios from "axios"
import DefaultLayout from "layouts/default"
import initialState from "states/prediction"
import logger from "use-reducer-logger"
import NumberFormat from "react-number-format"
import PredictionForm from "components/PredictionForm"
import PropTypes from "prop-types"
import reducer from "reducers/prediction"
import ThemeContext from "themeContext"

const toastConfig = getConfig()
toast.configure(toastConfig)

const Prediction = ({ history, match }) => {
    const { state } = useContext(ThemeContext)
    const { inverted } = state
    const { slug } = match.params
    const [internalState, dispatch] = useReducer(
        process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
        initialState
    )
    const { loaded, prediction } = internalState

    useEffect(() => {
        const getPrediction = async (slug) => {
            await axios
                .get(`${process.env.REACT_APP_BASE_URL}predictions/${slug}`)
                .then(async (response) => {
                    const prediction = response.data.data
                    dispatch({
                        type: "GET_PREDICTION",
                        prediction
                    })
                })
                .catch(() => {
                    toast.error("There was an error")
                })
        }

        getPrediction(slug)
    }, [slug])

    return (
        <DefaultLayout history={history} inverted={inverted} textAlign="center" useGrid={false}>
            {loaded ? (
                <>
                    <Header as="h1" inverted={inverted}>
                        <Header.Content>
                            {prediction.coin.name}
                            <Header.Subheader>
                                <NumberFormat
                                    decimalScale={2}
                                    displayType={"text"}
                                    prefix={"$"}
                                    thousandSeparator
                                    value={prediction.lastPrice}
                                />
                            </Header.Subheader>
                        </Header.Content>
                    </Header>
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
                            coin={prediction.coin}
                            defaultPrice={prediction.coin.lastPrice * 1.1}
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

Prediction.propTypes = {
    prediction: PropTypes.shape({
        category: PropTypes.string,
        circulatingSupply: PropTypes.number,
        dailyPercentChange: PropTypes.number,
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

export default Prediction

import { Divider, Header, Loader } from "semantic-ui-react"
import { useContext, useEffect, useReducer } from "react"
import { DisplayMetaTags } from "utils/metaFunctions"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import axios from "axios"
import DefaultLayout from "layouts/default"
import initialState from "states/prediction"
import logger from "use-reducer-logger"
import NumberFormat from "react-number-format"
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
        <DefaultLayout
            activeItem="predictions"
            containerClassName="predictionPage"
            history={history}
            inverted={inverted}
            textAlign="center"
            useGrid={false}
        >
            <DisplayMetaTags page="predictions" state={internalState} />
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

Prediction.propTypes = {
    history: PropTypes.object,
    match: PropTypes.object
}

export default Prediction

import { Divider, Header, Image, Loader } from "semantic-ui-react"
import { useContext, useEffect, useReducer } from "react"
import { DisplayMetaTags } from "utils/metaFunctions"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import axios from "axios"
import Chart from "components/Chart"
import DefaultLayout from "layouts/default"
import initialState from "states/prediction"
import logger from "use-reducer-logger"
import moment from "moment"
import Moment from "react-moment"
import NumberFormat from "react-number-format"
import PlaceholderPic from "images/images/image-square.png"
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

    console.log("loaded", loaded)
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
                        <Image
                            circular
                            onError={(i) => (i.target.src = PlaceholderPic)}
                            size="huge"
                            src={prediction.coin.logo}
                        />
                        <Header.Content>
                            {prediction.coin.symbol} to{" "}
                            <NumberFormat
                                decimalScale={2}
                                displayType={"text"}
                                prefix={"$"}
                                thousandSeparator
                                value={prediction.predictionPrice}
                            />{" "}
                            on <Moment date={prediction.targetDate} format="MMM D, YYYY" />
                            <Header.Subheader>
                                <Moment date={prediction.createdAt} fromNow />
                            </Header.Subheader>
                        </Header.Content>
                    </Header>

                    <Chart
                        coin={prediction.coin}
                        containerProps={{ style: { height: "250px" } }}
                        duration="1Y"
                        hideYAxis
                        includeRanges={false}
                        inverted={inverted}
                        period={86400}
                        prediction={{
                            date: moment(prediction.targetDate).unix(),
                            price: prediction.predictionPrice
                        }}
                    />
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

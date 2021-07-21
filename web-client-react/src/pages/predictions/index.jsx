import {
    Button,
    Card,
    Divider,
    Header,
    Icon,
    Image,
    Label,
    List,
    Loader,
    Segment
} from "semantic-ui-react"
import { useContext, useEffect, useReducer } from "react"
import { DisplayMetaTags } from "utils/metaFunctions"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import { dateDiff } from "utils/dateFunctions"
import { setIconColor } from "utils/textFunctions"
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
import UserPic from "images/avatar/large/steve.jpg"

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
                    <Header as="h1" className="predictionHeader" inverted={inverted}>
                        <Image
                            circular
                            onClick={() => history.push(`/coins/${prediction.coin.slug}`)}
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
                            />
                            <Header.Subheader>
                                On <Moment date={prediction.targetDate} format="MMM D, YYYY" /> •
                                Predicted <Moment date={prediction.createdAt} fromNow />
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
                            date: moment(prediction.targetDate).unix() * 1000,
                            price: prediction.predictionPrice
                        }}
                    />

                    <Card className={`${inverted ? "inverted" : null}`} fluid>
                        <Card.Content>
                            <Card.Description>{prediction.explanation}</Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <span className="left floated like">
                                <Icon color="pink" name="heart" size="large" />
                            </span>
                            <span className="left floated star" style={{ marginLeft: "10px" }}>
                                <Icon color="blue" name="share" size="large" />
                            </span>
                        </Card.Content>
                    </Card>

                    <Header as="h2" className="dividerHeader" inverted={inverted} size="huge">
                        Stats
                    </Header>

                    <Segment basic inverted={inverted} style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <List divided inverted={inverted} relaxed="very" size="big">
                            <List.Item>
                                Status{" "}
                                <Label
                                    basic
                                    className={inverted ? "inverted" : ""}
                                    color={setIconColor(prediction.status)}
                                    horizontal
                                    size="large"
                                >
                                    {prediction.status}
                                </Label>
                            </List.Item>
                            <List.Item>
                                Original Price{" "}
                                <Label
                                    basic
                                    className={inverted ? "inverted" : ""}
                                    color="orange"
                                    horizontal
                                    size="large"
                                >
                                    ${prediction.currentPrice}
                                </Label>
                            </List.Item>
                            <List.Item>
                                Actual price
                                {prediction.status === "Pending" ? (
                                    <span style={{ float: "right" }}>N/A</span>
                                ) : (
                                    <Label
                                        basic
                                        className={inverted ? "inverted" : ""}
                                        color="violet"
                                        horizontal
                                        size="large"
                                    >
                                        ${prediction.actualPrice}
                                    </Label>
                                )}
                            </List.Item>
                            <List.Item>
                                Margin of error{" "}
                                {prediction.status === "Pending" ? (
                                    <span style={{ float: "right" }}>N/A</span>
                                ) : (
                                    <Label
                                        basic
                                        className={inverted ? "inverted" : ""}
                                        color="teal"
                                        horizontal
                                        size="large"
                                    >
                                        {prediction.margin}%
                                    </Label>
                                )}
                            </List.Item>
                            <List.Item>
                                Prediction length{" "}
                                <Label
                                    basic
                                    className={inverted ? "inverted" : ""}
                                    color="olive"
                                    horizontal
                                    size="large"
                                >
                                    {dateDiff(prediction.createdAt, prediction.targetDate)} days
                                </Label>
                            </List.Item>
                        </List>
                    </Segment>

                    <Header as="h2" className="dividerHeader" inverted={inverted} size="huge">
                        Predicter
                    </Header>

                    <Card className={`${inverted ? "inverted" : null}`}>
                        <Image
                            label={{ as: "a", corner: "left", icon: "heart" }}
                            onError={(i) => (i.target.src = UserPic)}
                            src={prediction.user.img}
                            ui={false}
                            wrapped
                        />
                        <Card.Content>
                            <Card.Header>{prediction.user.name}</Card.Header>
                            <Card.Meta>
                                <span className="date">@{prediction.user.username}</span>
                            </Card.Meta>
                            <Card.Description>{prediction.user.bio}</Card.Description>
                        </Card.Content>
                        <Button
                            animated="fade"
                            attached="bottom"
                            color="pink"
                            onClick={() => history.push(`/${prediction.user.username}`)}
                        >
                            <Button.Content visible>Ask {prediction.user.name}</Button.Content>
                            <Button.Content hidden>Get a prediction</Button.Content>
                        </Button>
                    </Card>

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

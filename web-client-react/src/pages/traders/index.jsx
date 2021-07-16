import { Divider, Grid, Header, Image, Label, List, Loader, Segment } from "semantic-ui-react"
import { useContext, useEffect, useReducer, useState } from "react"
import { DisplayMetaTags } from "utils/metaFunctions"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import axios from "axios"
import DefaultLayout from "layouts/default"
import initialState from "states/trader"
import logger from "use-reducer-logger"
import PlaceholderPic from "images/avatar/large/steve.jpg"
import PredictionList from "components/PredictionList"
import PropTypes from "prop-types"
import reducer from "reducers/trader"
import ThemeContext from "themeContext"

const toastConfig = getConfig()
toast.configure(toastConfig)

const Trader = ({ history, match }) => {
    const { state } = useContext(ThemeContext)
    const { inverted } = state
    const { username } = match.params

    const [internalState, dispatch] = useReducer(
        process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
        initialState
    )
    const { loaded, predictions, trader } = internalState
    const [activeItem, setActiveItem] = useState("all")

    useEffect(() => {
        const getTrader = async (user) => {
            await axios
                .get(`${process.env.REACT_APP_BASE_URL}users/${username}`)
                .then(async (response) => {
                    const trader = response.data.data
                    dispatch({
                        type: "GET_TRADER",
                        trader
                    })
                    getPredictions(trader.id, null)
                })
                .catch(() => {
                    toast.error("There was an error")
                })
        }

        getTrader(username)
    }, [username])

    const getPredictions = async (userId, status, sort = "created_at", dir = "desc") => {
        dispatch({
            type: "SET_LOADING_PREDICTIONS"
        })

        await axios
            .get(`${process.env.REACT_APP_BASE_URL}predictions`, {
                params: {
                    userId,
                    status,
                    sort,
                    dir
                }
            })
            .then((response) => {
                const predictions = response.data.data
                dispatch({
                    type: "GET_PREDICTIONS",
                    predictions
                })
            })
            .catch(() => {
                toast.error("There was an error")
            })
    }

    const onClickPrediction = (id) => {
        history.push(`/predictions/${id}`)
    }

    return (
        <DefaultLayout
            activeItem="traders"
            containerClassName="traderPage"
            history={history}
            inverted={inverted}
            textAlign="center"
            useGrid={false}
        >
            <DisplayMetaTags page="trader" state={internalState} />
            {loaded ? (
                <>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column className="imgColumn" width={4}>
                                <Segment circular>
                                    <Image
                                        bordered
                                        circular
                                        className="inverted"
                                        onError={(i) => (i.target.src = PlaceholderPic)}
                                        size="small"
                                        src={trader.img}
                                    />
                                </Segment>
                            </Grid.Column>
                            <Grid.Column width={12}>
                                <Header as="h1" inverted={inverted}>
                                    <Header.Content>
                                        {trader.name}
                                        <Header.Subheader>@{trader.username}</Header.Subheader>
                                    </Header.Content>
                                    <Label
                                        basic
                                        className={inverted ? "inverted" : null}
                                        color="pink"
                                    >
                                        {trader.accuracy.toFixed(2)} % accurate
                                    </Label>
                                </Header>
                                <Header as="p" inverted={inverted} size="small">
                                    {trader.bio}
                                </Header>
                                <List horizontal inverted={inverted} size="large">
                                    <List.Item
                                        as="a"
                                        className={activeItem === "all" ? "active" : null}
                                        onClick={() => {
                                            setActiveItem("all")
                                            getPredictions(trader.id, null)
                                        }}
                                    >
                                        <List.Content>
                                            <List.Header>
                                                {trader.predictionsCount} predictions
                                            </List.Header>
                                        </List.Content>
                                    </List.Item>
                                    <List.Item
                                        as="a"
                                        className={activeItem === "correct" ? "active" : null}
                                        onClick={() => {
                                            setActiveItem("correct")
                                            getPredictions(trader.id, "Correct")
                                        }}
                                    >
                                        <List.Content>
                                            <List.Header>
                                                <span className="green">
                                                    {trader.correctPredictionsCount}
                                                </span>{" "}
                                                correct
                                            </List.Header>
                                        </List.Content>
                                    </List.Item>
                                    <List.Item
                                        as="a"
                                        className={activeItem === "incorrect" ? "active" : null}
                                        onClick={() => {
                                            setActiveItem("incorrect")
                                            getPredictions(trader.id, "Incorrect")
                                        }}
                                    >
                                        <List.Content>
                                            <List.Header>
                                                <span className="red">
                                                    {trader.incorrectPredictionsCount}
                                                </span>{" "}
                                                wrong
                                            </List.Header>
                                        </List.Content>
                                    </List.Item>
                                    <List.Item
                                        as="a"
                                        className={activeItem === "pending" ? "active" : null}
                                        onClick={() => {
                                            setActiveItem("pending")
                                            getPredictions(trader.id, "Pending")
                                        }}
                                    >
                                        <List.Content>
                                            <List.Header>
                                                <span className="orange">
                                                    {trader.pendingPredictionsCount}
                                                </span>{" "}
                                                pending
                                            </List.Header>
                                        </List.Content>
                                    </List.Item>
                                </List>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>

                    <Divider hidden section />

                    <PredictionList
                        inverted={inverted}
                        loading={predictions.loading}
                        predictions={predictions.data}
                        onClickPrediction={onClickPrediction}
                    />
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

Trader.propTypes = {
    history: PropTypes.object,
    match: PropTypes.object
}

export default Trader

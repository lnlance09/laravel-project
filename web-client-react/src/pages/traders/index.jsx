import { Divider, Grid, Header, Image, List, Loader, Segment } from "semantic-ui-react"
import { useContext, useEffect, useReducer } from "react"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import axios from "axios"
import DefaultLayout from "layouts/default"
import initialState from "states/trader"
import logger from "use-reducer-logger"
import PlaceholderPic from "images/avatar/large/steve.jpg"
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
    const { loaded, trader } = internalState

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
                })
                .catch(() => {
                    toast.error("There was an error")
                })
        }

        getTrader(username)
    }, [username])

    return (
        <DefaultLayout
            containerClassName="traderPage"
            history={history}
            inverted={inverted}
            textAlign="center"
            useGrid={false}
        >
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
                                    {trader.name}
                                    <Header.Subheader>@{trader.username}</Header.Subheader>
                                </Header>
                                <Header as="p" inverted={inverted} size="small">
                                    {trader.bio}
                                </Header>
                                <List horizontal inverted={inverted} size="large">
                                    <List.Item>
                                        <List.Content>
                                            <List.Header>
                                                {trader.predictionsCount} predictions
                                            </List.Header>
                                        </List.Content>
                                    </List.Item>
                                    <List.Item>
                                        <List.Content>
                                            <List.Header>
                                                {trader.correctPredictionsCount} correct
                                            </List.Header>
                                        </List.Content>
                                    </List.Item>
                                    <List.Item>
                                        <List.Content>
                                            <List.Header>
                                                {trader.incorrectPredictionsCount} wrong
                                            </List.Header>
                                        </List.Content>
                                    </List.Item>
                                </List>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>

                    <Divider inverted={inverted} section />
                    <Segment basic inverted={inverted}></Segment>
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

Trader.propTypes = {
    history: PropTypes.object,
    match: PropTypes.object
}

export default Trader

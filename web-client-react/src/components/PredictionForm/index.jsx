import "react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css"
import "./style.scss"
import { useState } from "react"
import { Button, Divider, Form, Grid, Header, Segment } from "semantic-ui-react"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import axios from "axios"
import Chart from "components/Chart"
import moment from "moment"
import NumberFormat from "react-number-format"
import SemanticDatepicker from "react-semantic-ui-datepickers"
import PropTypes from "prop-types"

const toastConfig = getConfig()
toast.configure(toastConfig)

const PredictionForm = ({ coin, defaultPrice = "", history, inverted }) => {
    const [date, setDate] = useState(moment().add(30, "days").toDate())
    const [daysFromNow, setDaysFromNow] = useState(30)
    const [loading, setLoading] = useState(false)
    const [operator, setOperator] = useState("more")
    const [price, setPrice] = useState(defaultPrice)

    const calculatePriceDiff = (oldPrice, newPrice) => {
        const price = parseFloat(newPrice - oldPrice, 10)
        const percent = (price / oldPrice) * 100
        return {
            percentDiff: percent.toFixed(2),
            priceDiff: price
        }
    }

    const changeDate = (e, data) => {
        setDate(data.value)
        const now = moment(new Date())
        const newDate = moment(new Date(data.value))
        const duration = moment.duration(newDate.diff(now))
        setDaysFromNow(Math.ceil(duration.asDays()))
    }

    const submitPrediction = async () => {
        setLoading(true)
        await axios
            .post(
                `${process.env.REACT_APP_BASE_URL}predictions/create`,
                {
                    coin: coin.id,
                    predictionPrice: price,
                    targetDate: date
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("bearer")}`
                    }
                }
            )
            .then((response) => {
                const { data } = response.data
                history.push(`/predictions/${data.id}`)
            })
            .catch((error) => {
                let errorMsg = ""
                const { status } = error.response
                const { errors } = error.response.data

                if (status === 401) {
                    errorMsg = error.response.data.message
                } else {
                    if (typeof errors.targetDate !== "undefined") {
                        errorMsg = errors.targetDate[0]
                    }

                    if (typeof errors.predictionPrice !== "undefined") {
                        errorMsg = errors.predictionPrice[0]
                    }

                    if (typeof errors.coin !== "undefined") {
                        errorMsg = errors.coin[0]
                    }
                }

                setLoading(false)
                toast.error(errorMsg)
            })
    }

    const { percentDiff, priceDiff } = calculatePriceDiff(coin.lastPrice, price)

    const formIsValid = priceDiff !== 0 && date !== ""

    return (
        <div className="predictionFormComponent">
            <Form size="large">
                <Form.Group widths="equal">
                    <Form.Field>
                        <div className={`ui labeled input ${inverted ? "inverted" : ""}`}>
                            <div className="ui basic label label">$</div>
                            <NumberFormat
                                decimalScale={2}
                                onValueChange={(values) => {
                                    const { value } = values
                                    setPrice(value)
                                    const { priceDiff } = calculatePriceDiff(defaultPrice, value)
                                    setOperator(priceDiff > 0 ? "more" : "less")
                                }}
                                thousandSeparator
                                thousandsGroupStyle="dollar"
                                value={price}
                            />
                        </div>
                    </Form.Field>
                    <Form.Field className="dateField">
                        <SemanticDatepicker
                            className="fluid inverted"
                            datePickerOnly
                            filterDate={(date) => {
                                const now = new Date()
                                return date >= now
                            }}
                            format="MMM D, YYYY"
                            inverted={inverted}
                            onChange={changeDate}
                            placeholder="Pick a date"
                            showOutsideDays
                            value={date}
                        />
                    </Form.Field>
                </Form.Group>
                {formIsValid && (
                    <>
                        <Divider inverted={inverted} />
                        <Grid divided inverted={inverted} stackable>
                            <Grid.Row>
                                <Grid.Column width={8}>
                                    <Chart
                                        coin={coin}
                                        color={operator === "more" ? "green" : "red"}
                                        containerProps={{ style: { height: "250px" } }}
                                        duration="1Y"
                                        hideYAxis
                                        includeRanges={false}
                                        inverted={inverted}
                                        period={86400}
                                        prediction={{
                                            date: Math.round(new Date(date).getTime()),
                                            price: parseFloat(price, 10)
                                        }}
                                    />
                                </Grid.Column>
                                <Grid.Column width={8}>
                                    <Segment inverted={inverted}>
                                        <Header as="p" inverted={inverted}>
                                            You're predicting that {coin.symbol} will be worth{" "}
                                            <span className={operator === "more" ? "green" : "red"}>
                                                {percentDiff}%
                                            </span>{" "}
                                            {operator}{" "}
                                            <span className="daysFromNow">{daysFromNow} days</span>{" "}
                                            from now
                                        </Header>
                                    </Segment>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </>
                )}
            </Form>
            <Divider inverted={inverted} />
            <Button
                color="blue"
                content="Predict"
                disabled={!formIsValid}
                fluid
                loading={loading}
                onClick={submitPrediction}
                size="large"
            />
        </div>
    )
}

PredictionForm.propTypes = {
    coin: PropTypes.shape({
        category: PropTypes.string,
        circulatingSupply: PropTypes.number,
        cmcId: PropTypes.number,
        description: PropTypes.string,
        id: PropTypes.number,
        lastPrice: PropTypes.number,
        logo: PropTypes.string,
        marketCap: PropTypes.number,
        maxSupply: PropTypes.number,
        name: PropTypes.string,
        percentages: PropTypes.shape({
            "1h": PropTypes.number,
            "24h": PropTypes.number,
            "7d": PropTypes.number,
            "30d": PropTypes.number,
            "60d": PropTypes.number,
            "90d": PropTypes.number
        }),
        predictionsCount: PropTypes.number,
        slug: PropTypes.string,
        symbol: PropTypes.string,
        totalSupply: PropTypes.number
    }),
    defaultPrice: PropTypes.string,
    inverted: PropTypes.bool
}

export default PredictionForm

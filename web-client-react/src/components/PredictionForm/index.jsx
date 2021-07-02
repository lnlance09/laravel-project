import "react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css"
import "./style.scss"
import { useEffect, useState } from "react"
import { Button, Divider, Form, Header, Icon, Segment } from "semantic-ui-react"
import Chart from "components/Chart"
import moment from "moment"
import NumberFormat from "react-number-format"
import SemanticDatepicker from "react-semantic-ui-datepickers"
import PropTypes from "prop-types"

const PredictionForm = ({ coin, defaultPrice = "", history, inverted }) => {
    const [date, setDate] = useState(new Date())
    const [daysFromNow, setDaysFromNow] = useState(1)
    const [operator, setOperator] = useState("more")
    const [percentDiff, setPercentDiff] = useState(0)
    const [price, setPrice] = useState(defaultPrice)
    const [priceDiff, setPriceDiff] = useState(10)

    useEffect(() => {
        const { percent, price } = calculatePriceDiff(coin.lastPrice, defaultPrice)
        setPriceDiff(price)
        setPercentDiff(percent)
    }, [])

    const formIsValid = price > 0 && priceDiff !== 0 && date !== ""

    const changeDate = (e, data) => {
        setDate(data.value)

        const now = moment(new Date())
        const newDate = moment(new Date(data.value))
        const duration = moment.duration(newDate.diff(now))
        setDaysFromNow(Math.ceil(duration.asDays()))
    }

    const calculatePriceDiff = (oldPrice, newPrice) => {
        const price = parseInt(newPrice - oldPrice, 10)
        const percent = Math.round((price / oldPrice) * 100)
        return {
            percent,
            price
        }
    }

    return (
        <div className="predictionFormComponent">
            <Form size="large">
                <Form.Group widths="equal">
                    <Form.Field>
                        <Header as="p" inverted={inverted} textAlign="center">
                            The value will be{" "}
                        </Header>
                        <div className={`ui labeled input ${inverted ? "inverted" : ""}`}>
                            <div className="ui basic label label">$</div>
                            <NumberFormat
                                decimalScale={2}
                                onValueChange={(values) => {
                                    const { value } = values
                                    setPrice(value)

                                    const { percent, price } = calculatePriceDiff(
                                        defaultPrice,
                                        value
                                    )
                                    setPriceDiff(price)
                                    setPercentDiff(percent)
                                    setOperator(price > 0 ? "more" : "less")
                                }}
                                thousandSeparator
                                thousandsGroupStyle="dollar"
                                value={price}
                            />
                        </div>
                    </Form.Field>
                    <Form.Field className="dateField">
                        <Header as="p" inverted={inverted} textAlign="center">
                            When?{" "}
                        </Header>
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
                        <Chart
                            coin={coin}
                            duration="1Y"
                            hideYAxis
                            includeRanges={false}
                            inverted={inverted}
                            period={86400}
                            prediction={{
                                date: Math.round(new Date(date).getTime()),
                                price: parseInt(price, 10)
                            }}
                        />
                        <Divider inverted={inverted} />
                        <Segment inverted={inverted} placeholder>
                            <Header icon>
                                <Icon name="chess" />
                                You're predicting that {coin.symbol} will be worth{" "}
                                <span className={operator === "more" ? "green" : "red"}>
                                    {percentDiff}%
                                </span>{" "}
                                {operator} <span className="daysFromNow">{daysFromNow} days</span>{" "}
                                from now
                            </Header>
                        </Segment>
                    </>
                )}
                <Divider inverted={inverted} />
                <Button content="Submit" disabled={!formIsValid} fluid primary size="large" />
            </Form>
        </div>
    )
}

PredictionForm.propTypes = {
    coin: PropTypes.shape({
        category: PropTypes.string,
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
    }),
    defaultPrice: PropTypes.number,
    inverted: PropTypes.bool
}

export default PredictionForm

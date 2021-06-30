import "react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css"
import "./style.scss"
import { useEffect, useState } from "react"
import { Button, Divider, Form, Header, Input } from "semantic-ui-react"
import _ from "lodash"
import Chart from "components/Chart"
import SemanticDatepicker from "react-semantic-ui-datepickers"
import PropTypes from "prop-types"

const PredictionForm = ({ coin, history }) => {
    const [date, setDate] = useState("")
    const [price, setPrice] = useState("")

    const changeDate = (event, data) => setDate(data.value)

    const changePrice = (e, { value }) => {
        if (!_.isNaN(Number(value)) || value === ".") {
            setPrice(value)
        }
    }

    const formIsValid = price > 0 && date !== ""

    return (
        <div className="prediction-form">
            <Form size="large">
                <Form.Group widths="equal">
                    <Form.Field>
                        <Header as="p" textAlign="center">
                            The value will be{" "}
                        </Header>
                        <Input
                            label={{ basic: true, content: "$" }}
                            onChange={changePrice}
                            placeholder="Price"
                            value={price}
                        />
                    </Form.Field>
                    <Form.Field className="dateField">
                        <Header as="p" textAlign="center">
                            When?{" "}
                        </Header>
                        <SemanticDatepicker
                            className="fluid"
                            datePickerOnly
                            filterDate={(date) => {
                                const now = new Date()
                                return date >= now
                            }}
                            format="MMM D, YYYY"
                            onChange={changeDate}
                            placeholder="Pick a date"
                            showOutsideDays
                            value={date}
                        />
                    </Form.Field>
                </Form.Group>
                {formIsValid && (
                    <>
                        <Chart coin={coin} hideYAxis includeRanges={false} />
                    </>
                )}
                <Divider />
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
    })
}

export default PredictionForm

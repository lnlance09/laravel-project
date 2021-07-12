import "fomantic-ui-css/semantic.min.css"
import "./style.scss"
import { Item } from "semantic-ui-react"
import PredictionItem from "./item"
import PropTypes from "prop-types"

const PredictionList = ({ inverted, loading, onClickPrediction, predictions }) => {
    return (
        <div className="predictionList">
            <Item.Group className={inverted ? "inverted" : ""} divided link>
                {predictions.map((prediction, i) => {
                    return (
                        <PredictionItem
                            inverted={inverted}
                            loading={loading}
                            onClickPrediction={onClickPrediction}
                            prediction={prediction}
                        />
                    )
                })}
            </Item.Group>
        </div>
    )
}

PredictionList.propTypes = {
    inverted: PropTypes.bool,
    loading: PropTypes.bool,
    onClickPrediction: PropTypes.func,
    predictions: PropTypes.arrayOf(PropTypes.shape({}))
}

export default PredictionList

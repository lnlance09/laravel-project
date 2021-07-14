import "./style.scss"
import { Item, Label, Placeholder } from "semantic-ui-react"
import { setIconColor, setIconName, setImage } from "utils/textFunctions"
import Moment from "react-moment"
import PlaceholderPic from "images/images/image.png"
import PropTypes from "prop-types"

const PredictionList = ({ inverted, loading, onClickPrediction, predictions }) => (
    <div className="predictionList">
        <Item.Group className={inverted ? "inverted" : ""} divided link>
            {predictions.map((prediction, i) => {
                const { coin, createdAt, id, predictionPrice, status, targetDate } = prediction
                return (
                    <Item key={`prediction${i}`} onClick={() => onClickPrediction(id)}>
                        {loading ? (
                            <>
                                <Placeholder
                                    inverted={inverted}
                                    style={{ height: 90, width: 90, marginRight: "1em" }}
                                >
                                    <Placeholder.Image />
                                </Placeholder>
                                <Item.Content>
                                    <Placeholder inverted={inverted} fluid>
                                        <Placeholder.Paragraph>
                                            <Placeholder.Line />
                                            <Placeholder.Line />
                                            <Placeholder.Line />
                                        </Placeholder.Paragraph>
                                    </Placeholder>
                                </Item.Content>
                            </>
                        ) : (
                            <>
                                <Item.Image
                                    onError={(i) => (i.target.src = PlaceholderPic)}
                                    size="tiny"
                                    src={setImage(coin.logo)}
                                />
                                <Item.Content>
                                    <Item.Header>
                                        {coin.name} to ${predictionPrice} on{" "}
                                        <Moment date={targetDate} format="MMM D, YYYY" />
                                    </Item.Header>
                                    <Item.Meta>
                                        <Moment date={createdAt} fromNow />
                                    </Item.Meta>
                                    <Item.Description></Item.Description>
                                    <Item.Extra>
                                        <Label
                                            basic
                                            className={inverted ? "inverted" : ""}
                                            color={setIconColor(status)}
                                            content={status}
                                            icon={setIconName(status)}
                                        />
                                    </Item.Extra>
                                </Item.Content>
                            </>
                        )}
                    </Item>
                )
            })}
        </Item.Group>
    </div>
)

PredictionList.propTypes = {
    inverted: PropTypes.bool,
    loading: PropTypes.bool,
    onClickPrediction: PropTypes.func,
    predictions: PropTypes.arrayOf(PropTypes.shape({}))
}

export default PredictionList

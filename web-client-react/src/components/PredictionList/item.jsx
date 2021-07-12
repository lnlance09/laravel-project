import { Item, Label, Placeholder } from "semantic-ui-react"
import { formatPlural } from "utils/textFunctions"
import Moment from "react-moment"
import PlaceholderPic from "images/images/image.png"
import PropTypes from "prop-types"

const PredictionItem = ({ inverted, loading, onClickPrediction, prediction }) => {
    const { coin, createdAt, id, predictionPrice, status, targetDate } = prediction

    const setIconColor = (status) => {
        switch (status) {
            case "Correct":
                return "green"
            case "Incorrect":
                return "red"
            default:
                return "orange"
        }
    }

    const setIconName = (status) => {
        switch (status) {
            case "Correct":
                return "check"
            case "Incorrect":
                return "close"
            default:
                return "hourglass"
        }
    }

    const setImage = (img) => {
        return img.replace("64x64", "128x128")
    }

    return (
        <Item key={`prediction${id}`} onClick={() => onClickPrediction(id)}>
            {loading ? (
                <Item.Content>
                    <Placeholder fluid inverted={inverted}>
                        <Placeholder.Paragraph>
                            <Placeholder.Line length="full" />
                            <Placeholder.Line length="long" />
                            <Placeholder.Line length="short" />
                        </Placeholder.Paragraph>
                    </Placeholder>
                </Item.Content>
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
}

PredictionItem.propTypes = {
    inverted: PropTypes.bool,
    loading: PropTypes.bool,
    onClickPrediction: PropTypes.func,
    prediction: PropTypes.shape({})
}

export default PredictionItem

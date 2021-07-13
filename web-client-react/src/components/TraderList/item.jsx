import { Icon, Item, Label, Placeholder } from "semantic-ui-react"
import { formatPlural } from "utils/textFunctions"
import PlaceholderPic from "images/images/image.png"
import PropTypes from "prop-types"

const TraderItem = ({ i, inverted, loading, onClickTrader, trader }) => {
    const { accuracy, bio, img, name, predictionsCount, username } = trader

    return (
        <Item key={`trader${i}`} onClick={() => onClickTrader(username)}>
            {loading ? (
                <>
                    <Placeholder
                        inverted={inverted}
                        style={{ height: 150, width: 150, marginRight: "1em" }}
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
                        size="small"
                        src={img}
                    />
                    <Item.Content>
                        <Item.Header>{name}</Item.Header>
                        <Item.Meta>@{username}</Item.Meta>
                        <Item.Description>{bio}</Item.Description>
                        <Item.Extra>
                            <Label
                                className={inverted ? "inverted" : ""}
                                color={accuracy > 50 ? "green" : "red"}
                            >
                                <Icon name="bullseye" />
                                {accuracy.toFixed(2)}%
                            </Label>
                            <Label className={inverted ? "inverted" : ""} color="violet">
                                {predictionsCount} {formatPlural(predictionsCount, "prediction")}
                            </Label>
                        </Item.Extra>
                    </Item.Content>
                </>
            )}
        </Item>
    )
}

TraderItem.propTypes = {
    i: PropTypes.number,
    inverted: PropTypes.bool,
    loading: PropTypes.bool,
    onClickTrader: PropTypes.func,
    prediction: PropTypes.shape({})
}

export default TraderItem

import "./style.scss"
import { Item, Label, Placeholder } from "semantic-ui-react"
import { formatPlural } from "utils/textFunctions"
import PlaceholderPic from "images/images/image.png"
import PropTypes from "prop-types"

const TraderList = ({ inverted, loading, loadingMore, onClickTrader, traders }) => (
    <div className="traderList">
        <Item.Group className={inverted ? "inverted" : ""} divided link>
            {traders.map((trader, i) => {
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
                                            basic
                                            className={inverted ? "inverted" : ""}
                                            color="orange"
                                        >
                                            {accuracy.toFixed(2)}% accurate
                                        </Label>
                                        <Label
                                            basic
                                            className={inverted ? "inverted" : ""}
                                            color="blue"
                                        >
                                            {predictionsCount}{" "}
                                            {formatPlural(predictionsCount, "prediction")}
                                        </Label>
                                    </Item.Extra>
                                </Item.Content>
                            </>
                        )}
                    </Item>
                )
            })}
            {loadingMore && (
                <Item key="loadingMore">
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
                </Item>
            )}
        </Item.Group>
    </div>
)

TraderList.propTypes = {
    inverted: PropTypes.bool,
    loading: PropTypes.bool,
    loadingMore: PropTypes.bool,
    onClickTrader: PropTypes.func,
    traders: PropTypes.arrayOf(PropTypes.shape({}))
}

export default TraderList

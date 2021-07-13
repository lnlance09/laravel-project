import "fomantic-ui-css/semantic.min.css"
import "./style.scss"
import { Item, Placeholder, Segment } from "semantic-ui-react"
import TraderItem from "./item"
import PropTypes from "prop-types"

const TraderList = ({ inverted, loading, loadingMore, onClickTrader, traders }) => {
    return (
        <div className="traderList">
            <Item.Group className={inverted ? "inverted" : ""} divided link>
                {traders.map((trader, i) => {
                    return (
                        <TraderItem
                            i={i}
                            inverted={inverted}
                            loading={loading}
                            onClickTrader={onClickTrader}
                            trader={trader}
                        />
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
}

TraderList.propTypes = {
    inverted: PropTypes.bool,
    loading: PropTypes.bool,
    loadingMore: PropTypes.bool,
    onClickTrader: PropTypes.func,
    traders: PropTypes.arrayOf(PropTypes.shape({}))
}

export default TraderList

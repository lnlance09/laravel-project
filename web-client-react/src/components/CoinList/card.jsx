import "./style.scss"
import "fomantic-ui-css/semantic.min.css"
import { useState } from "react"
import { Card, Icon, Image, Placeholder } from "semantic-ui-react"
import PlaceholderPic from "images/images/image.png"
import PropTypes from "prop-types"
import Truncate from "react-truncate"

const CoinCard = ({ coin, inverted, onClickCoin }) => {
    const { dailyPercentChange, description, id, logo, name, slug, symbol } = coin

    const [expanded, setExpanded] = useState(false)
    const [truncated, setTruncated] = useState(false)

    const handleTruncate = (isTruncated) => {
        if (truncated !== isTruncated) {
            setTruncated(isTruncated)
        }
    }

    const toggleLines = () => {
        setExpanded(!expanded)
    }

    return (
        <Card key={`coin${id}`} onClick={() => onClickCoin(slug)}>
            {typeof id === "undefined" ? (
                <Card.Content>
                    <Placeholder fluid inverted={inverted}>
                        <Placeholder.Paragraph>
                            <Placeholder.Line length="full" />
                            <Placeholder.Line length="long" />
                            <Placeholder.Line length="short" />
                        </Placeholder.Paragraph>
                    </Placeholder>
                </Card.Content>
            ) : (
                <>
                    <Card.Content>
                        <Image
                            bordered
                            floated="right"
                            onError={(i) => (i.target.src = PlaceholderPic)}
                            size="mini"
                            src={logo}
                        />
                        <Card.Header>{name}</Card.Header>
                        <Card.Meta>
                            {symbol}{" "}
                            <span className={`percent ${dailyPercentChange > 0 ? "green" : "red"}`}>
                                {dailyPercentChange > 0 ? "+" : ""}
                                {dailyPercentChange}%
                            </span>
                        </Card.Meta>
                        <Card.Description>
                            <Truncate
                                ellipsis={
                                    <span>
                                        ...{" "}
                                        <span className="ellipsisSpan" onClick={toggleLines}>
                                            Read more
                                        </span>
                                    </span>
                                }
                                lines={!expanded && 3}
                                onTruncate={handleTruncate}
                            >
                                {description}
                            </Truncate>
                            {!truncated && expanded && (
                                <span>
                                    {" "}
                                    <span className="ellipsisSpan" onClick={toggleLines}>
                                        Show less
                                    </span>
                                </span>
                            )}
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <a>
                            <Icon name="user" />
                            10 Friends
                        </a>
                    </Card.Content>
                </>
            )}
        </Card>
    )
}

CoinCard.propTypes = {
    coin: PropTypes.shape({
        category: PropTypes.string,
        circulatingSupply: PropTypes.number,
        dailyPercentChange: PropTypes.string,
        description: PropTypes.string,
        expanded: PropTypes.bool,
        id: PropTypes.number,
        lastPrice: PropTypes.number,
        logo: PropTypes.string,
        marketCap: PropTypes.number,
        maxSupply: PropTypes.number,
        name: PropTypes.string,
        slug: PropTypes.string,
        symbol: PropTypes.string,
        totalSupply: PropTypes.number,
        truncated: PropTypes.bool
    }),
    inverted: PropTypes.bool,
    onClickCoin: PropTypes.func
}

export default CoinCard

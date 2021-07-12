import { useState } from "react"
import { Card, Image, Placeholder } from "semantic-ui-react"
import { formatPlural } from "utils/textFunctions"
import PlaceholderPic from "images/images/image.png"
import PropTypes from "prop-types"
import Truncate from "react-truncate"

const CoinCard = ({ coin, inverted, loading, onClickCoin }) => {
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
            {loading ? (
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
                        {coin.predictionsCount} {formatPlural(coin.predictionsCount, "prediction")}
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
        id: PropTypes.number,
        lastPrice: PropTypes.number,
        logo: PropTypes.string,
        marketCap: PropTypes.number,
        maxSupply: PropTypes.number,
        name: PropTypes.string,
        predictionsCount: PropTypes.number,
        slug: PropTypes.string,
        symbol: PropTypes.string,
        totalSupply: PropTypes.number
    }),
    inverted: PropTypes.bool,
    loading: PropTypes.bool,
    onClickCoin: PropTypes.func
}

export default CoinCard

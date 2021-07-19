import "./style.scss"
import { Card, Image, Placeholder } from "semantic-ui-react"
import { formatPlural } from "utils/textFunctions"
import PlaceholderPic from "images/images/image-square.png"
import PropTypes from "prop-types"
import Truncate from "react-truncate"

const CoinList = ({ coins, inverted, loading, onClickCoin }) => (
    <div className="coinList">
        <Card.Group className={inverted ? "inverted" : ""} itemsPerRow={3} stackable>
            {coins.map((coin, i) => {
                const { description, logo, name, slug, symbol } = coin
                return (
                    <Card key={`coin${i}`} onClick={() => onClickCoin(slug)}>
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
                                        <span
                                            className={`percent ${
                                                coin.percentages["24h"] > 0 ? "green" : "red"
                                            }`}
                                        >
                                            {coin.percentages["24h"] > 0 ? "+" : ""}
                                            {coin.percentages["24h"]}%
                                        </span>
                                    </Card.Meta>
                                    <Card.Description>
                                        <Truncate ellipsis={<span>...</span>} lines={4}>
                                            {description}
                                        </Truncate>
                                    </Card.Description>
                                </Card.Content>
                                <Card.Content extra>
                                    {coin.predictionsCount}{" "}
                                    {formatPlural(coin.predictionsCount, "prediction")}
                                </Card.Content>
                            </>
                        )}
                    </Card>
                )
            })}
        </Card.Group>
    </div>
)

CoinList.propTypes = {
    coins: PropTypes.arrayOf(
        PropTypes.shape({
            category: PropTypes.string,
            circulatingSupply: PropTypes.number,
            cmcId: PropTypes.number,
            description: PropTypes.string,
            id: PropTypes.number,
            lastPrice: PropTypes.number,
            logo: PropTypes.string,
            marketCap: PropTypes.number,
            maxSupply: PropTypes.number,
            name: PropTypes.string,
            percentages: PropTypes.shape({
                "1h": PropTypes.number,
                "24h": PropTypes.number,
                "7d": PropTypes.number,
                "30d": PropTypes.number,
                "60d": PropTypes.number,
                "90d": PropTypes.number
            }),
            predictionsCount: PropTypes.number,
            slug: PropTypes.string,
            symbol: PropTypes.string,
            totalSupply: PropTypes.number
        })
    ),
    inverted: PropTypes.bool,
    loading: PropTypes.bool,
    onClickCoin: PropTypes.func
}

export default CoinList

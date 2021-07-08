import "./style.scss"
import { Image, List, Placeholder } from "semantic-ui-react"
import PlaceholderPic from "images/images/image.png"
import PropTypes from "prop-types"

const CoinList = ({ coins, inverted, onClickCoin }) => {
    return (
        <div className="coinList">
            <List animated divided inverted={inverted} relaxed="very" selection size="big">
                {coins.map((coin) => (
                    <List.Item onClick={() => onClickCoin(coin)}>
                        {typeof coin.id === "undefined" ? (
                            <>
                                <Placeholder fluid>
                                    <Placeholder.Paragraph>
                                        <Placeholder.Line length="full" />
                                        <Placeholder.Line length="short" />
                                    </Placeholder.Paragraph>
                                </Placeholder>
                            </>
                        ) : (
                            <>
                                <Image
                                    avatar
                                    onError={(i) => (i.target.src = PlaceholderPic)}
                                    src={coin.logo}
                                />
                                <List.Content>
                                    <List.Header>{coin.name}</List.Header>
                                    {coin.price}
                                </List.Content>
                            </>
                        )}
                    </List.Item>
                ))}
            </List>
        </div>
    )
}

CoinList.propTypes = {
    coins: PropTypes.arrayOf(
        PropTypes.shape({
            category: PropTypes.string,
            circulatingSupply: PropTypes.number,
            dailyPercentChange: PropTypes.number,
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
    ),
    inverted: PropTypes.bool,
    onClickCoin: PropTypes.func
}

export default CoinList

import { Image, List } from "semantic-ui-react"
import PlaceholderPic from "images/images/image.png"
import PropTypes from "prop-types"

const CoinList = ({ coins, onClickCoin }) => {
    return (
        <div className="coinList">
            <List animated divided relaxed="very" selection size="big">
                {coins.map((coin) => (
                    <List.Item onClick={() => onClickCoin(coin)}>
                        <Image
                            avatar
                            onError={(i) => (i.target.src = PlaceholderPic)}
                            src={coin.logo}
                        />
                        <List.Content>
                            <List.Header>{coin.name}</List.Header>
                            {coin.price}
                        </List.Content>
                    </List.Item>
                ))}
            </List>
        </div>
    )
}

CoinList.propTypes = {
    coins: PropTypes.arrayOf(
        PropTypes.shape({
            logo: PropTypes.string,
            market_cap: PropTypes.number,
            max_supply: PropTypes.number,
            name: PropTypes.string.isRequired,
            total_supply: PropTypes.number
        })
    ),
    onClickCoin: PropTypes.func
}

export default CoinList

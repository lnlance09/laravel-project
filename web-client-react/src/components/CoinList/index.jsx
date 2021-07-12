import "fomantic-ui-css/semantic.min.css"
import "./style.scss"
import { Card } from "semantic-ui-react"
import CoinCard from "./card"
import PropTypes from "prop-types"

const CoinList = ({ coins, inverted, loading, onClickCoin }) => {
    return (
        <div className="coinList">
            <Card.Group className={inverted ? "inverted" : ""} itemsPerRow={3}>
                {coins.map((coin) => {
                    return (
                        <CoinCard
                            coin={coin}
                            inverted={inverted}
                            loading={loading}
                            onClickCoin={onClickCoin}
                        />
                    )
                })}
            </Card.Group>
        </div>
    )
}

CoinList.propTypes = {
    coins: PropTypes.arrayOf(
        PropTypes.shape({
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
        })
    ),
    inverted: PropTypes.bool,
    loading: PropTypes.bool,
    onClickCoin: PropTypes.func
}

export default CoinList

import { Divider, Header, List } from "semantic-ui-react"
import { useContext, useEffect, useReducer } from "react"
import { DisplayMetaTags } from "utils/metaFunctions"
import { Link } from "react-router-dom"
import axios from "axios"
import DefaultLayout from "layouts/default"
import initialState from "states/about"
import logger from "use-reducer-logger"
import PropTypes from "prop-types"
import reducer from "reducers/about"
import ThemeContext from "themeContext"

const About = ({ history }) => {
	const { state } = useContext(ThemeContext)
	const { inverted } = state

	const [internalState, dispatch] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)
	const { coins } = internalState

	useEffect(() => {
		getCoins()
	}, [])

	const getCoins = async () => {
		axios
			.get(`${process.env.REACT_APP_BASE_URL}coins`)
			.then((response) => {
				const coins = response.data.data
				dispatch({
					type: "GET_COINS",
					coins
				})
			})
			.catch(() => {
				console.error("There was an error")
			})
	}

	return (
		<DefaultLayout
			activeItem="about"
			containerClassName="aboutPage"
			history={history}
			inverted={inverted}
			textAlign="center"
		>
			<DisplayMetaTags page="about" />

			<Header as="h1" content="About" inverted={inverted} />

			<Header as="p" inverted={inverted}>
				Preditc is a social network for abmitous cryptocurrency traders looking to make
				their marks on the world. Disgruntled with the seemingly endless pool of YouTube
				pundits who promise their audiences that they can get rich overnight, there needed
				to be a system that measures the accuracy of traders, pundits and talking heads. The
				result was Preditc, something that helps separate true, honest traders from ones who
				just blow hot air and play guessing games.
			</Header>

			<Header as="h2" content="Supported Coins" inverted={inverted} />

			{coins.length > 0 && (
				<>
					<Header as="p" inverted={inverted}>
						Predictions about the following{" "}
						<Link to="/coins">{coins.length === 0}</Link> coins are supported on
						Preditc.
					</Header>

					<List bulleted inverted={inverted} relaxed size="big">
						{coins.map((coin) => (
							<List.Item
								onClick={() => history.push(`/coins/${coin.slug}`)}
								value="*"
							>
								<List.Content>
									<List.Header>{coin.name}</List.Header>
								</List.Content>
							</List.Item>
						))}
					</List>
				</>
			)}

			<Divider hidden />
		</DefaultLayout>
	)
}

About.propTypes = {
	history: PropTypes.object
}

export default About

import { Header } from "semantic-ui-react"
import { useContext } from "react"
import { DisplayMetaTags } from "utils/metaFunctions"
import DefaultLayout from "layouts/default"
import PropTypes from "prop-types"
import ThemeContext from "themeContext"

const Rules = ({ history }) => {
	const { state } = useContext(ThemeContext)
	const { inverted } = state

	return (
		<DefaultLayout
			activeItem="rules"
			containerClassName="rulesPage"
			history={history}
			inverted={inverted}
			textAlign="center"
		>
			<DisplayMetaTags page="rules" />

			<Header as="h1" className="massive" content="Rules" inverted={inverted} />

			<Header as="h2" content="Edits" inverted={inverted} />
			<Header as="p" inverted={inverted}>
				Predictions cannot be made
			</Header>

			<Header as="h2" content="Timing" inverted={inverted} />
			<Header as="p" inverted={inverted}>
				Predictions cannot be made
			</Header>

			<Header as="h2" content="Margin of error" inverted={inverted} />
			<Header as="p" inverted={inverted}>
				Predictions cannot be made
			</Header>

			<Header as="h2" content="Wallets" inverted={inverted} />
			<Header as="p" inverted={inverted}>
				Predictions cannot be made
			</Header>
		</DefaultLayout>
	)
}

Rules.propTypes = {
	history: PropTypes.object
}

export default Rules

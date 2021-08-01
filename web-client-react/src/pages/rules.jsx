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

			<Header as="h1" content="Rules" inverted={inverted} />

			<Header as="p" inverted={inverted} style={{ fontWeight: "normal" }}>
				Preditc is a
			</Header>
		</DefaultLayout>
	)
}

Rules.propTypes = {
	history: PropTypes.object
}

export default Rules

import { useContext } from "react"
import { DisplayMetaTags } from "utils/metaFunctions"
import DefaultLayout from "layouts/default"
import PropTypes from "prop-types"
import ThemeContext from "themeContext"

const Privacy = ({ history }) => {
	const { state } = useContext(ThemeContext)
	const { inverted } = state

	return (
		<DefaultLayout
			activeItem="privacy"
			containerClassName="privacyPage"
			history={history}
			inverted={inverted}
			textAlign="center"
		>
			<DisplayMetaTags page="privacy" />
		</DefaultLayout>
	)
}

Privacy.propTypes = {
	history: PropTypes.object
}

export default Privacy

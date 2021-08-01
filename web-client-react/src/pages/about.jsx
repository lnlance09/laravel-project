import { Header } from "semantic-ui-react"
import { useContext } from "react"
import { DisplayMetaTags } from "utils/metaFunctions"
import DefaultLayout from "layouts/default"
import PropTypes from "prop-types"
import ThemeContext from "themeContext"

const About = ({ history }) => {
	const { state } = useContext(ThemeContext)
	const { inverted } = state

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

			<Header as="p" inverted={inverted} style={{ fontWeight: "normal" }}>
				Preditc is a
			</Header>
		</DefaultLayout>
	)
}

About.propTypes = {
	history: PropTypes.object
}

export default About

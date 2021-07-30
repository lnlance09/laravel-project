import { Button } from "semantic-ui-react"
import { useContext } from "react"
import { DisplayMetaTags } from "utils/metaFunctions"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import axios from "axios"
import DefaultLayout from "layouts/default"
import PropTypes from "prop-types"
import ThemeContext from "themeContext"

const toastConfig = getConfig()
toast.configure(toastConfig)

const Contact = ({ history }) => {
	const { state } = useContext(ThemeContext)
	const { inverted } = state

	return (
		<DefaultLayout
			activeItem="contact"
			containerClassName="contactPage"
			history={history}
			inverted={inverted}
			textAlign="center"
		>
			<DisplayMetaTags page="contact" />

			<Button color="blue" content="Send" />
		</DefaultLayout>
	)
}

Contact.propTypes = {
	history: PropTypes.object
}

export default Contact

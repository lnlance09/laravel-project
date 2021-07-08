import { Container, Segment } from "semantic-ui-react"
import { useContext } from "react"
import Authentication from "components/Authentication"
import DefaultLayout from "layouts/default"
import ThemeContext from "themeContext"

const SignIn = ({ history }) => {
    const { inverted } = useContext(ThemeContext)

    return (
        <DefaultLayout
            containerClassName="signInPage"
            history={history}
            inverted={inverted}
            useGrid={false}
        >
            <Container className="authContainer" textAlign="center">
                <Authentication inverted={inverted} />
            </Container>
        </DefaultLayout>
    )
}

export default SignIn

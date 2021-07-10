import { Container } from "semantic-ui-react"
import { useContext } from "react"
import Authentication from "components/Authentication"
import DefaultLayout from "layouts/default"

import ThemeContext from "themeContext"

const SignIn = ({ history }) => {
    const { state } = useContext(ThemeContext)
    const params = new URLSearchParams(window.location.search)
    const type = params.get("type")

    return (
        <DefaultLayout
            containerClassName="signInPage"
            history={history}
            inverted={state.inverted}
            simpleHeader
            useGrid={false}
        >
            <Container className="authContainer" textAlign="center">
                <Authentication
                    history={history}
                    inverted={state.inverted}
                    login={type !== "join"}
                />
            </Container>
        </DefaultLayout>
    )
}

export default SignIn

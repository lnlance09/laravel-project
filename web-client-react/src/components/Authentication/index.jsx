import "./style.scss"
import { Button, Divider, Form, Header, Input, Segment } from "semantic-ui-react"
import { useCallback, useReducer, useState } from "react"
import { getConfig } from "options/toast"
import { setToken } from "utils/tokenFunctions"
import { toast } from "react-toastify"
import axios from "axios"
import initialState from "./state"
import logger from "use-reducer-logger"
import PropTypes from "prop-types"
import reducer from "./reducer"

const toastConfig = getConfig()
toast.configure(toastConfig)

const Authentication = (props) => {
    const [state, dispatch] = useReducer(
        process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
        initialState
    )

    const [buttonText, setButtonText] = useState(props.login ? "Create an account" : "Sign in")
    const [email, setEmail] = useState("")
    const [headerText, setHeaderText] = useState(props.login ? "Sign In" : "Sign Up")
    const [loadingLogin, setLoadingLogin] = useState(false)
    const [loadingRegistration, setLoadingRegistration] = useState(false)
    const [login, setLogin] = useState(props.login)
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [regEmail, setRegEmail] = useState("")
    const [registerText, setRegisterText] = useState(
        props.login ? "New to this site?" : "Already have an account?"
    )
    const [regPassword, setRegPassword] = useState("")
    const [username, setUsername] = useState("")
    const [verificationCode, setVerificationCode] = useState("")

    const toggleLogin = useCallback(() => {
        setButtonText(login ? "Sign in" : "Create an account")
        setHeaderText(login ? "Join" : "Sign In")
        setRegisterText(login ? "Already have an account?" : "New to this site?")
        setLoadingLogin(false)
        setLoadingRegistration(false)
        setLogin(!login)
    }, [login])

    const submitLoginForm = () => {
        if (email.length > 0 && password.length > 0) {
            setLoadingLogin(true)

            axios
                .post("/api/user/login", {
                    email,
                    password
                })
                .then(async (response) => {
                    const { data } = response
                    dispatch({
                        payload: data,
                        type: "SET_USER_DATA"
                    })

                    setToken(data.user)
                    if (data.user.emailVerified) {
                        props.history.push("/")
                    }
                })
                .catch((error) => {
                    toast.error(error.response.data.msg)

                    dispatch({
                        payload: error.response.data,
                        type: "SET_LOGIN_ERROR"
                    })
                })
        }
    }

    const submitRegistrationForm = () => {
        setLoadingRegistration(true)
        axios
            .post("/api/user/create", {
                email,
                name,
                password,
                username
            })
            .then(async (response) => {
                const { data } = response
                dispatch({
                    payload: data,
                    type: "SET_USER_DATA"
                })

                setToken(data.user)
            })
            .catch((error) => {
                toast.error(error.response.data.msg)

                dispatch({
                    payload: error.response.data,
                    type: "SET_REGISTER_ERROR"
                })
            })
    }

    const submitVerificationForm = () => {
        if (verificationCode.length === 4) {
            axios
                .post(
                    "/api/user/verify",
                    {
                        code: verificationCode
                    },
                    {
                        headers: {
                            // Authorization: bearer
                        }
                    }
                )
                .then(async (response) => {
                    const { data } = response
                    dispatch({
                        payload: data,
                        type: "VERIFY_EMAIL"
                    })

                    setToken(data.user)
                    if (!data.error) {
                        props.history.push("/")
                    }
                })
                .catch((error) => {
                    toast.error(error.response.data.msg)

                    dispatch({
                        payload: error.response.data,
                        type: "SET_VERIFICATION_ERROR"
                    })
                })
        }
    }

    const MainForm = () => {
        if (props.verify) {
            return (
                <Form inverted={props.inverted} onSubmit={submitVerificationForm} size={props.size}>
                    <Form.Field>
                        <Input
                            inverted={props.inverted}
                            maxLength={4}
                            onChange={(e, { value }) => setVerificationCode(value)}
                            placeholder="Verification code"
                            value={verificationCode}
                        />
                    </Form.Field>
                    <Button
                        color="blue"
                        content="Verify"
                        disabled={verificationCode.length !== 4}
                        fluid
                        size={props.size}
                        type="submit"
                    />
                </Form>
            )
        }

        if (login) {
            return (
                <Form inverted={props.inverted} size={props.size}>
                    <Form.Field>
                        <Input
                            inverted={props.inverted}
                            onChange={(e, { value }) => {
                                setEmail(value)
                            }}
                            placeholder="Email or username"
                            value={email}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Input
                            inverted={props.inverted}
                            onChange={(e, { value }) => {
                                setPassword(value)
                            }}
                            placeholder="Password"
                            type="password"
                            value={password}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Button
                            color="yellow"
                            content="Sign in"
                            fluid
                            loading={loadingLogin && !props.loginError}
                            onClick={submitLoginForm}
                            size="big"
                            type="submit"
                        />
                    </Form.Field>
                </Form>
            )
        }

        return (
            <>
                <Form inverted={props.inverted} size={props.size}>
                    <Form.Field>
                        <Input
                            inverted={props.inverted}
                            onChange={(e, { value }) => {
                                setRegEmail(value)
                            }}
                            placeholder="Email"
                            value={regEmail}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Input
                            inverted={props.inverted}
                            onChange={(e, { value }) => {
                                setRegPassword(value)
                            }}
                            value={regPassword}
                            placeholder="Password"
                            type="password"
                        />
                    </Form.Field>
                    <Form.Field>
                        <Input
                            autoComplete="off"
                            inverted={props.inverted}
                            onChange={(e, { value }) => {
                                setName(value)
                            }}
                            placeholder="Full name"
                            value={name}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Input
                            inverted={props.inverted}
                            onChange={(e, { value }) => {
                                setUsername(value)
                            }}
                            placeholder="Username"
                            value={username}
                        />
                    </Form.Field>
                </Form>
                <Divider inverted={props.inverted} />
                <Button
                    color="blue"
                    content="Create an account"
                    fluid
                    loading={loadingRegistration && !props.registerError}
                    onClick={submitRegistrationForm}
                    size={props.size}
                />
            </>
        )
    }

    return (
        <div className="authComponent">
            <Header as="h1" inverted={props.inverted} size="huge">
                {props.verify ? "Verify your email" : headerText}
            </Header>

            <Segment basic className="authSegment" inverted={props.inverted}>
                {MainForm()}
            </Segment>

            {!props.verify && (
                <Header as="p" className="registerText" inverted={props.inverted}>
                    {registerText}{" "}
                    <span className="registerLink" onClick={() => toggleLogin()}>
                        {buttonText}
                    </span>
                </Header>
            )}
        </div>
    )
}

Authentication.propTypes = {
    bearer: PropTypes.string,
    inverted: PropTypes.bool,
    login: PropTypes.bool,
    loginError: PropTypes.bool,
    loginErrorMsg: PropTypes.string,
    registerError: PropTypes.bool,
    registerErrorMsg: PropTypes.string,
    size: PropTypes.string,
    verify: PropTypes.bool,
    verifyError: PropTypes.bool,
    verifyErrorMsg: PropTypes.string
}

Authentication.defaultProps = {
    inverted: false,
    login: false,
    size: "large"
}

export default Authentication

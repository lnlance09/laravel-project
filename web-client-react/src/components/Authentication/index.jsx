import "./style.scss"
import { Button, Divider, Form, Header, Icon, Input, Segment } from "semantic-ui-react"
import { useContext, useState } from "react"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import axios from "axios"
import PropTypes from "prop-types"
import ThemeContext from "themeContext"
import validator from "validator"

const toastConfig = getConfig()
toast.configure(toastConfig)

const Authentication = (props) => {
    const { state, dispatch } = useContext(ThemeContext)
    const [buttonText, setButtonText] = useState(props.login ? "Create an account" : "Sign in")
    const [email, setEmail] = useState("")
    const [footerText, setFooterText] = useState(
        props.login ? "New to this site?" : "Already have an account?"
    )
    const [forgot, setForgot] = useState(false)
    const [forgotEmail, setForgotEmail] = useState("")
    const [headerText, setHeaderText] = useState(props.login ? "Sign In" : "Sign Up")
    const [loadingLogin, setLoadingLogin] = useState(false)
    const [loadingRegistration, setLoadingRegistration] = useState(false)
    const [login, setLogin] = useState(props.login)
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [register, setRegister] = useState(!props.login)
    const [regEmail, setRegEmail] = useState("")
    const [regPassword, setRegPassword] = useState("")
    const [showFooter, setShowFooter] = useState(true)
    const [username, setUsername] = useState("")
    const [verificationCode, setVerificationCode] = useState("")

    const submitForgotPassword = () => {
        axios
            .post(`${process.env.REACT_APP_BASE_URL}users/forgot`, {
                email: forgotEmail
            })
            .then(async (response) => {
                const { data } = response
            })
            .catch((error) => {
                toast.error(error.response.data.message)
            })
    }

    const submitLoginForm = () => {
        if (email.length > 0 && password.length > 0) {
            setLoadingLogin(true)
            axios
                .post(`${process.env.REACT_APP_BASE_URL}users/login`, {
                    email,
                    password
                })
                .then(async (response) => {
                    const { data } = response
                    dispatch({
                        type: "SET_USER_DATA",
                        data
                    })
                    localStorage.setItem("auth", true)
                    localStorage.setItem("bearer", data.bearer)
                    localStorage.setItem("user", JSON.stringify(data.user))
                    localStorage.setItem("verify", data.verify)
                    if (!data.verify) {
                        props.history.push("/")
                    } else {
                        setHeaderText("Verify your email")
                        setShowFooter(false)
                    }
                })
                .catch((error) => {
                    let errorMsg = ""
                    const { status } = error.response
                    const { errors } = error.response.data

                    if (status === 401) {
                        errorMsg = error.response.data.message
                    } else {
                        if (typeof errors.password !== "undefined") {
                            errorMsg = errors.password[0]
                        }

                        if (typeof errors.email !== "undefined") {
                            errorMsg = errors.email[0]
                        }
                    }

                    setLoadingLogin(false)
                    toast.error(errorMsg)
                })
        }
    }

    const submitRegistrationForm = () => {
        setLoadingRegistration(true)
        axios
            .post(`${process.env.REACT_APP_BASE_URL}users/create`, {
                email: regEmail,
                name,
                password: regPassword,
                username
            })
            .then(async (response) => {
                const { data } = response
                dispatch({
                    type: "SET_USER_DATA",
                    data
                })
                setHeaderText("Verify your email")
                setShowFooter(false)

                localStorage.setItem("auth", true)
                localStorage.setItem("bearer", data.bearer)
                localStorage.setItem("user", JSON.stringify(data.user))
                localStorage.setItem("verify", data.verify)
            })
            .catch((error) => {
                let errorMsg = ""
                const { errors } = error.response.data

                if (typeof errors.username !== "undefined") {
                    errorMsg = errors.username[0]
                }

                if (typeof errors.name !== "undefined") {
                    errorMsg = errors.name[0]
                }

                if (typeof errors.password !== "undefined") {
                    errorMsg = errors.password[0]
                }

                if (typeof errors.email !== "undefined") {
                    errorMsg = errors.email[0]
                }

                setLoadingRegistration(false)
                toast.error(errorMsg)
            })
    }

    const submitVerificationForm = () => {
        if (verificationCode.length === 4) {
            axios
                .post(
                    `${process.env.REACT_APP_BASE_URL}users/verify`,
                    {
                        code: verificationCode
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("bearer")}`
                        }
                    }
                )
                .then(async (response) => {
                    const { data } = response
                    dispatch({
                        type: "VERIFY_EMAIL"
                    })
                    localStorage.setItem("verify", data.verify)
                    props.history.push("/")
                })
                .catch((error) => {
                    toast.error(error.response.data.message)
                })
        }
    }

    const toggleLogin = () => {
        setButtonText(login ? "Sign in" : "Create an account")
        setHeaderText(login ? "Join" : "Sign In")
        setFooterText(login ? "Already have an account?" : "New to this site?")
        setLoadingLogin(false)
        setLoadingRegistration(false)
        setLogin(!login)
        setRegister(login)
    }

    return (
        <div className="authComponent">
            <Header as="h1" inverted={props.inverted} size="huge">
                {headerText}
            </Header>

            <Segment basic className="authSegment" inverted={props.inverted}>
                {forgot && (
                    <Form
                        inverted={props.inverted}
                        onSubmit={submitForgotPassword}
                        size={props.size}
                    >
                        <Form.Field>
                            <Input
                                icon="mail"
                                iconPosition="left"
                                inverted={props.inverted}
                                onChange={(e, { value }) => setForgotEmail(value)}
                                placeholder="Enter your email"
                                value={forgotEmail}
                            />
                        </Form.Field>
                        <Button
                            color="blue"
                            content="Send Instructions"
                            disabled={!validator.isEmail(forgotEmail)}
                            fluid
                            size={props.size}
                            type="submit"
                        />
                    </Form>
                )}

                {state.verify && (
                    <Form
                        inverted={props.inverted}
                        onSubmit={submitVerificationForm}
                        size={props.size}
                    >
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
                )}

                {login && (
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
                                color="blue"
                                content="Sign in"
                                fluid
                                loading={loadingLogin && !props.loginError}
                                onClick={submitLoginForm}
                                size={props.size}
                                type="submit"
                            />
                        </Form.Field>
                    </Form>
                )}

                {register && (
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
                )}
            </Segment>

            {showFooter && (
                <Header as="p" className="footerText" inverted={props.inverted}>
                    {footerText}{" "}
                    <span
                        className="footerLink"
                        onClick={() => {
                            toggleLogin()
                            setForgot(false)
                        }}
                    >
                        {buttonText}
                    </span>
                </Header>
            )}

            {login && (
                <Header
                    as="p"
                    className="forgotText"
                    inverted={props.inverted}
                    onClick={() => {
                        setForgot(true)
                        setHeaderText("Reset your password")
                        setShowFooter(false)
                        setLogin(false)
                        setRegister(false)
                    }}
                    size="small"
                >
                    Forgot password?
                </Header>
            )}

            {forgot && (
                <Header
                    as="p"
                    className="forgotText"
                    inverted={props.inverted}
                    onClick={() => {
                        setForgot(false)
                        setHeaderText("Sign In")
                        setShowFooter(true)
                        setLogin(true)
                    }}
                    size="small"
                >
                    <Icon name="arrow left" /> Back to login
                </Header>
            )}
        </div>
    )
}

Authentication.propTypes = {
    inverted: PropTypes.bool,
    login: PropTypes.bool,
    size: PropTypes.string
}

Authentication.defaultProps = {
    inverted: false,
    login: false,
    size: "large"
}

export default Authentication

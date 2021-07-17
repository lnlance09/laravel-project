import "./style.scss"
import { Button, Container, Dropdown, Header, Icon, Image, Menu, Sidebar } from "semantic-ui-react"
import { useContext, useState } from "react"
import defaultImg from "images/images/image.png"
import Logo from "images/logos/main.png"
import PropTypes from "prop-types"
import ThemeContext from "themeContext"

const PageHeader = ({ activeItem, history, q, showResults, simple }) => {
    const { state, dispatch } = useContext(ThemeContext)
    const { auth, inverted, user } = state
    const [sidebarVisible, setSidebarVisible] = useState(false)

    const logout = () => {
        localStorage.setItem("auth", false)
        localStorage.setItem("bearer", null)
        localStorage.setItem("user", null)
        localStorage.setItem("verify", false)
        dispatch({
            type: "LOGOUT"
        })
    }

    const trigger = (
        <>
            {user && (
                <>
                    <span style={{ marginLeft: "12px", marginRight: "12px" }}>{user.name}</span>
                    <Image avatar onError={(i) => (i.target.src = defaultImg)} src={user.img} />
                </>
            )}
        </>
    )

    return (
        <div className="pageHeaderComponent">
            {simple ? (
                <Container fluid textAlign="center">
                    <Image
                        className="simpleLogo"
                        inline
                        onClick={() => history.push("/")}
                        onError={(i) => (i.target.src = defaultImg)}
                        rounded
                        src={Logo}
                    />
                </Container>
            ) : (
                <Menu borderless fixed="top" fluid inverted={inverted}>
                    <Container>
                        <Menu.Item className="logoItem">
                            <Header as="h1" inverted={inverted} onClick={() => history.push("/")}>
                                <Image className="headerLogo" rounded src={Logo} />
                                Preditc
                            </Header>
                        </Menu.Item>
                        <Menu.Item
                            active={activeItem === "coins"}
                            onClick={() => {
                                history.push("/coins")
                            }}
                        >
                            Coins
                        </Menu.Item>
                        <Menu.Item
                            active={activeItem === "predictions"}
                            onClick={() => history.push("/predictions")}
                        >
                            Predictions
                        </Menu.Item>
                        <Menu.Item
                            active={activeItem === "traders"}
                            onClick={() => history.push("/traders")}
                        >
                            Traders
                        </Menu.Item>
                        <Menu.Item position="right">
                            <Button
                                circular
                                color="purple"
                                className="moonButton"
                                icon
                                onClick={() => {
                                    const inverted = localStorage.getItem("inverted")
                                    localStorage.setItem(
                                        "inverted",
                                        inverted === "false" ? "true" : "false"
                                    )
                                    dispatch({ type: "TOGGLE_INVERTED" })
                                }}
                            >
                                <Icon inverted={inverted} name="moon" size="large" />
                            </Button>
                            {auth ? (
                                <Dropdown
                                    className={inverted ? "inverted" : null}
                                    direction="bottom"
                                    icon={false}
                                    pointing="top"
                                    trigger={trigger}
                                >
                                    <Dropdown.Menu>
                                        <Dropdown.Item
                                            onClick={() => history.push(`/${user.username}`)}
                                        >
                                            Profile
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => history.push("/settings")}>
                                            Settings
                                        </Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item onClick={logout}>Sign Out</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            ) : (
                                <>
                                    <Button
                                        content="Log In"
                                        onClick={() => history.push("/login")}
                                        secondary
                                        size="large"
                                    />
                                    <Button
                                        content="Sign Up"
                                        onClick={() => history.push("/login?type=join")}
                                        primary
                                        size="large"
                                    />
                                </>
                            )}
                        </Menu.Item>
                    </Container>
                </Menu>
            )}

            <Sidebar
                as={Menu}
                animation="push"
                borderless
                direction="bottom"
                icon="labeled"
                inverted={inverted}
                onHide={() => setSidebarVisible(false)}
                size="massive"
                style={{ textAlign: "left" }}
                vertical
                visible={sidebarVisible}
            >
                <Menu.Item as="a" onClick={() => history.push("/")}>
                    <Icon name="home" size="small" />
                    Home
                </Menu.Item>
                {auth && (
                    <Menu.Item as="a" onClick={() => history.push(`/${user.username}`)}>
                        <Icon name="user" size="small" />
                        Profile
                    </Menu.Item>
                )}
            </Sidebar>
        </div>
    )
}

PageHeader.propTypes = {
    activeItem: PropTypes.string,
    history: PropTypes.object,
    q: PropTypes.string,
    showResults: PropTypes.bool,
    simple: PropTypes.bool,
    toggleSearchMode: PropTypes.func
}

PageHeader.defaultProps = {
    activeItem: null,
    q: "",
    showResults: true,
    simple: false
}

export default PageHeader

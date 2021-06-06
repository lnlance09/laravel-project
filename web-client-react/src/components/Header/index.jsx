import "./style.scss"
import Logo from "images/logos/main.png"
import { parseJwt } from "utils/tokenFunctions"
import { Button, Container, Header, Icon, Image, Menu, Sidebar } from "semantic-ui-react"
import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"

const PageHeader = ({ history, q, showResults }) => {
    const [authenticated, setAuthenticated] = useState(null)
    const [sidebarVisible, setSidebarVisible] = useState(false)
    const [user, setUser] = useState({})

    useEffect(() => {
        const userData = parseJwt()
        if (userData) {
            setUser(userData)
            setAuthenticated(true)
        } else {
            setAuthenticated(false)
        }
    }, [])

    return (
        <div className="page-header">
            <Container className="mobile">
                <Menu borderless fitted="vertically" fixed="top" fluid>
                    <Container>
                        <Menu.Item>
                            <Header as="h1">
                                <Image
                                    className="headerLogo"
                                    onClick={() => history.push("/")}
                                    rounded
                                    src={Logo}
                                />
                                Moonbois
                            </Header>
                        </Menu.Item>
                        <Menu.Item>Coins</Menu.Item>
                        <Menu.Item>Predictions</Menu.Item>
                        <Menu.Item>Influencers</Menu.Item>
                        <Menu.Item>About</Menu.Item>
                        <Menu.Item position="right">
                            {authenticated === false && (
                                <>
                                    <Button
                                        color="secondary"
                                        content="Log In"
                                        onClick={() => history.push("/login")}
                                    />
                                    <Button
                                        color="primary"
                                        content="Sign Up"
                                        onClick={() => history.push("/register")}
                                    />
                                </>
                            )}
                        </Menu.Item>
                    </Container>
                </Menu>
            </Container>

            <Sidebar
                as={Menu}
                animation="push"
                borderless
                direction="bottom"
                icon="labeled"
                inverted
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
                {authenticated && (
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
    q: PropTypes.string,
    showResults: PropTypes.bool,
    toggleSearchMode: PropTypes.func
}

PageHeader.defaultProps = {
    q: "",
    showResults: true
}

export default PageHeader

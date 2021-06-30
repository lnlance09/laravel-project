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
            <Menu borderless fixed="top" fluid>
                <Container>
                    <Menu.Item>
                        <Header as="h1">
                            <Image
                                className="headerLogo"
                                onClick={() => history.push("/")}
                                rounded
                                src={Logo}
                            />
                            Sample App
                        </Header>
                    </Menu.Item>
                    <Menu.Item as="a" onClick={() => history.push("/coins")}>
                        Coins
                    </Menu.Item>
                    <Menu.Item as="a" onClick={() => history.push("/predictions")}>
                        Predictions
                    </Menu.Item>
                    <Menu.Item as="a" onClick={() => history.push("/influencers")}>
                        Influencers
                    </Menu.Item>
                    <Menu.Item as="a" onClick={() => history.push("/about")}>
                        About
                    </Menu.Item>
                    <Menu.Item position="right">
                        {authenticated === false && (
                            <>
                                <Button
                                    content="Log In"
                                    onClick={() => history.push("/login")}
                                    secondary
                                />
                                <Button
                                    content="Sign Up"
                                    onClick={() => history.push("/register")}
                                    primary
                                />
                            </>
                        )}
                    </Menu.Item>
                </Container>
            </Menu>

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
    history: PropTypes.object,
    q: PropTypes.string,
    showResults: PropTypes.bool,
    toggleSearchMode: PropTypes.func
}

PageHeader.defaultProps = {
    q: "",
    showResults: true
}

export default PageHeader

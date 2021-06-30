import "react-toastify/dist/ReactToastify.css"
import "semantic-ui-css/semantic.min.css"
import "./scss/app.scss"
import React, { Component } from "react"
import { Route, Router, Switch } from "react-router-dom"
import ScrollToTop from "react-router-scroll-top"
import history from "history.js"
import Coin from "pages/coins"
import Coins from "pages/coins/show"
import Home from "pages/home"
import Logo from "./images/logos/main.png"
import NotFound from "pages/notFound"
import SignIn from "pages/signIn"
import SoundFile from "./sound.mp3"
import SoundFileAlt from "./sound.ogg"

class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            ignore: true,
            title: ""
        }

        // this.sendNotification = this.sendNotification.bind(this)
    }

    handleNotificationOnClick(e, tag) {
        window.location.href = e.currentTarget.data.url
    }

    handleNotificationOnClose(e, tag) {}

    handleNotificationOnError(e, tag) {}

    handleNotificationOnShow(e, tag) {
        // this.playSound()
    }

    handleNotSupported() {
        this.setState({ ignore: true })
    }

    handlePermissionDenied() {
        this.setState({ ignore: true })
    }

    handlePermissionGranted() {
        this.setState({ ignore: false })
    }

    playSound(filename) {
        // document.getElementById("sound").play()
    }

    sendNotification(title, body, url) {
        if (this.state.ignore) {
            return
        }

        const now = Date.now()
        const tag = now
        const options = {
            body,
            data: {
                url
            },
            dir: "ltr",
            icon: Logo,
            lang: "en",
            sound: "./sound.mp3",
            tag
        }

        this.setState({
            options,
            title,
            url
        })
    }

    render() {
        return (
            <div className="app">
                <Router history={history}>
                    <ScrollToTop>
                        <Switch>
                            <Route
                                exact
                                path="/"
                                render={(props) => (
                                    <Home key={window.location.pathname} {...props} />
                                )}
                            />

                            <Route component={Home} exact path="/home" />

                            <Route
                                exact
                                path="/coins"
                                render={(props) => (
                                    <Coins key={window.location.pathname} {...props} />
                                )}
                            />

                            <Route
                                exact
                                path="/coins/:slug"
                                render={(props) => (
                                    <Coin key={window.location.pathname} {...props} />
                                )}
                            />

                            <Route component={SignIn} path="/signin" />

                            <Route path="*" render={(props) => <NotFound {...props} />} />
                        </Switch>
                    </ScrollToTop>
                </Router>

                <audio id="sound" preload="auto">
                    <source src={SoundFile} type="audio/mpeg" />
                    <source src={SoundFileAlt} type="audio/ogg" />
                    <embed autostart="false" hidden loop={false} src={SoundFile} />
                </audio>
            </div>
        )
    }
}

export default App

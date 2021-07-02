import "react-toastify/dist/ReactToastify.css"
import "semantic-ui-css/semantic.min.css"
import "./scss/app.scss"
import React, { useState } from "react"
import { Route, Router, Switch } from "react-router-dom"
import Coin from "pages/coins"
import Coins from "pages/coins/show"
import history from "history.js"
import Home from "pages/home"
import Logo from "./images/logos/main.png"
import NotFound from "pages/notFound"
import ScrollToTop from "react-router-scroll-top"
import SignIn from "pages/signIn"
import SoundFile from "./sound.mp3"
import SoundFileAlt from "./sound.ogg"
import ThemeProvider from "components/ThemeProvider"

const App = () => {
    const [ignore, setIgonore] = useState(false)
    const [title, setTitle] = useState("")

    const handleNotificationOnClick = (e, tag) => {
        window.location.href = e.currentTarget.data.url
    }

    const handleNotificationOnClose = (e, tag) => {}

    const handleNotificationOnError = (e, tag) => {}

    const handleNotificationOnShow = (e, tag) => {}

    const handleNotSupported = () => {
        setIgonore(true)
    }

    const handlePermissionDenied = () => {
        setIgonore(true)
    }

    const handlePermissionGranted = () => {
        setIgonore(false)
    }

    const playSound = (filename) => {
        // document.getElementById("sound").play()
    }

    const sendNotification = (title, body, url) => {
        if (ignore) {
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

        setTitle(title)
        /*
        this.setState({
            options,
            title,
            url
        })
        */
    }

    return (
        <div className="app">
            <Router history={history}>
                <ThemeProvider>
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
                </ThemeProvider>
            </Router>

            <audio id="sound" preload="auto">
                <source src={SoundFile} type="audio/mpeg" />
                <source src={SoundFileAlt} type="audio/ogg" />
                <embed autostart="false" hidden loop={false} src={SoundFile} />
            </audio>
        </div>
    )
}

export default App

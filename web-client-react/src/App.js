import "react-toastify/dist/ReactToastify.css"
import "./semantic/dist/semantic.min.css"
import "./scss/app.scss"
import { Route, Router, Switch } from "react-router-dom"
import Coin from "pages/coins"
import Coins from "pages/coins/show"
import history from "history.js"
import Login from "pages/login"
import NotFound from "pages/notFound"
import Prediction from "pages/predictions"
import Predictions from "pages/predictions/show"
import ScrollToTop from "react-router-scroll-top"
import SoundFile from "./sound.mp3"
import SoundFileAlt from "./sound.ogg"
import ThemeProvider from "components/ThemeProvider"
import Trader from "pages/traders"
import Traders from "pages/traders/show"

const App = () => {
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
									<Predictions key={window.location.pathname} {...props} />
								)}
							/>

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

							<Route component={Login} path="/login" />

							<Route
								exact
								path="/predictions"
								render={(props) => (
									<Predictions key={window.location.pathname} {...props} />
								)}
							/>

							<Route
								exact
								path="/predictions/:slug"
								render={(props) => (
									<Prediction key={window.location.pathname} {...props} />
								)}
							/>

							<Route
								exact
								path="/traders"
								render={(props) => (
									<Traders key={window.location.pathname} {...props} />
								)}
							/>

							<Route
								exact
								path="/:username"
								render={(props) => (
									<Trader key={window.location.pathname} {...props} />
								)}
							/>

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

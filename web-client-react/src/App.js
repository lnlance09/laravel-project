import "react-toastify/dist/ReactToastify.css"
import "./semantic/dist/semantic.min.css"
import "./scss/app.scss"
import { Route, Router, Switch } from "react-router-dom"
import About from "pages/about"
import Applications from "pages/applications"
import Coin from "pages/coins"
import Coins from "pages/coins/show"
import Contact from "pages/contact"
import CreateWallet from "pages/createWallet"
import Forgot from "pages/forgot"
import history from "history.js"
import Login from "pages/login"
import NotFound from "pages/notFound"
import Prediction from "pages/predictions"
import Predictions from "pages/predictions/show"
import Privacy from "pages/privacy"
import Rules from "pages/rules"
import ScrollToTop from "react-router-scroll-top"
import Settings from "pages/settings"
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

							<Route component={About} exact path="/about" />

							<Route
								exact
								path="/applications"
								render={(props) => (
									<Applications key={window.location.pathname} {...props} />
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

							<Route component={Contact} exact path="/contact" />

							<Route
								exact
								path="/forgot"
								render={(props) => (
									<Forgot key={window.location.pathname} {...props} />
								)}
							/>

							<Route component={Login} exact path="/login" />

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

							<Route component={Privacy} exact path="/privacy" />

							<Route component={Rules} exact path="/rules" />

							<Route component={Settings} exact path="/settings" />

							<Route
								exact
								path="/traders"
								render={(props) => (
									<Traders key={window.location.pathname} {...props} />
								)}
							/>

							<Route
								exact
								path="/wallet/create"
								render={(props) => (
									<CreateWallet key={window.location.pathname} {...props} />
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
		</div>
	)
}

export default App

import "./style.scss"
import { Container, Grid, Header, List, Segment } from "semantic-ui-react"
import PropTypes from "prop-types"

const Footer = ({ history, inverted }) => {
	return (
		<div className="pageFooterComponent">
			<Segment inverted={inverted} vertical>
				<Container>
					<Grid divided inverted={inverted} stackable>
						<Grid.Row>
							<Grid.Column width={3}>
								<Header as="h4" inverted={inverted}>
									<span>👀</span>
									<span className="emojiMarginLeft">About</span>
								</Header>
								<List inverted={inverted} link relaxed>
									<List.Item as="a" onClick={() => history.push("/sitemap")}>
										Sitemap
									</List.Item>
									<List.Item as="a" onClick={() => history.push("/contact")}>
										Contact
									</List.Item>
									<List.Item as="a" onClick={() => history.push("/rules")}>
										Rules
									</List.Item>
									<List.Item as="a" onClick={() => history.push("/about")}>
										About
									</List.Item>
								</List>
							</Grid.Column>
							<Grid.Column width={3}>
								<Header as="h4" inverted={inverted}>
									<span>👍</span>{" "}
									<span className="emojiMarginLeft">Follow Us</span>
								</Header>
								<List inverted={inverted} link relaxed>
									<List.Item as="a">Twitter</List.Item>
									<List.Item as="a">Instagram</List.Item>
								</List>
							</Grid.Column>
							<Grid.Column width={7}>
								<Header as="h4" inverted={inverted}>
									<span>🎉</span>{" "}
									<span className="emojiMarginLeft">Support Us</span>
								</Header>
								<p>Address:</p>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Container>
			</Segment>
		</div>
	)
}

Footer.propTypes = {
	history: PropTypes.object,
	inverted: PropTypes.bool
}

export default Footer

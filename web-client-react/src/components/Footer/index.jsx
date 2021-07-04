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
                                <Header as="h4" content="About" inverted={inverted} />
                                <List inverted={inverted} link>
                                    <List.Item as="a">Sitemap</List.Item>
                                    <List.Item as="a">Contact</List.Item>
                                    <List.Item as="a">Privacy</List.Item>
                                    <List.Item as="a">About</List.Item>
                                </List>
                            </Grid.Column>
                            <Grid.Column width={3}>
                                <Header as="h4" content="Follow Us" inverted={inverted} />
                                <List inverted={inverted} link>
                                    <List.Item as="a">Twitter</List.Item>
                                    <List.Item as="a">Instagram</List.Item>
                                </List>
                            </Grid.Column>
                            <Grid.Column width={7}>
                                <Header as="h4" inverted={inverted}>
                                    Footer Header
                                </Header>
                                <p>
                                    Extra space for a call to action inside the footer that could
                                    help re-engage users.
                                </p>
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

import "./style.scss"
import { Container, Divider, Grid, Header, Image, List, Segment } from "semantic-ui-react"

function Footer() {
    return (
        <div className="page-footer">
            <Segment vertical style={{ margin: "5em 0em 0em", padding: "5em 0em" }}>
                <Container>
                    <Grid stackable>
                        <Grid.Column width={3}>
                            <Header as="h4" content="Group 1" />
                            <List link>
                                <List.Item as="a">Link One</List.Item>
                                <List.Item as="a">Link Two</List.Item>
                                <List.Item as="a">Link Three</List.Item>
                                <List.Item as="a">Link Four</List.Item>
                            </List>
                        </Grid.Column>
                        <Grid.Column width={3}>
                            <Header as="h4" content="Group 2" />
                            <List link>
                                <List.Item as="a">Link One</List.Item>
                                <List.Item as="a">Link Two</List.Item>
                                <List.Item as="a">Link Three</List.Item>
                                <List.Item as="a">Link Four</List.Item>
                            </List>
                        </Grid.Column>
                        <Grid.Column width={3}>
                            <Header as="h4" content="Group 3" />
                            <List link>
                                <List.Item as="a">Link One</List.Item>
                                <List.Item as="a">Link Two</List.Item>
                                <List.Item as="a">Link Three</List.Item>
                                <List.Item as="a">Link Four</List.Item>
                            </List>
                        </Grid.Column>
                    </Grid>

                    <Divider section />

                    <List horizontal divided link size="small">
                        <List.Item as="a" href="#">
                            Site Map
                        </List.Item>
                        <List.Item as="a" href="#">
                            Contact Us
                        </List.Item>
                        <List.Item as="a" href="#">
                            Terms and Conditions
                        </List.Item>
                        <List.Item as="a" href="#">
                            Privacy Policy
                        </List.Item>
                    </List>

                    <Divider section />
                </Container>
            </Segment>
        </div>
    )
}

export default Footer

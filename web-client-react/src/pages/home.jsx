import { Button, Container, Divider, Grid, Header, Icon, Image, Segment } from "semantic-ui-react"
import { useContext } from "react"
import DefaultLayout from "layouts/default"
import ThemeContext from "themeContext"

const Home = ({ history, mobile }) => {
    const { inverted } = useContext(ThemeContext)

    return (
        <DefaultLayout
            containerClassName="home full"
            history={history}
            inverted={inverted}
            textAlign="center"
            useGrid={false}
        >
            <Segment className="heroSegment" inverted={inverted} textAlign="center" vertical>
                <Container className="heroContainer" text>
                    <Header as="h1" content="Imagine-a-Company" inverted={inverted} />
                    <Header
                        as="h2"
                        content="Do whatever you want when you want to."
                        inverted={inverted}
                    />
                    <Button inverted={inverted} primary size="huge">
                        Get Started
                        <Icon inverted={inverted} name="right arrow" />
                    </Button>
                </Container>
            </Segment>
            <Container>
                <Segment className="padded" inverted={inverted} vertical>
                    <Grid container stackable verticalAlign="middle">
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <Header as="h3" inverted={inverted}>
                                    We Help Companies and Companions
                                </Header>
                                <p>
                                    We can give your company superpowers to do things that they
                                    never thought possible. Let us delight your customers and
                                    empower your needs... through pure data analytics.
                                </p>
                                <Header as="h3" inverted={inverted}>
                                    We Make Bananas That Can Dance
                                </Header>
                                <p>
                                    Yes that's right, you thought it was the stuff of dreams, but
                                    even bananas can be bioengineered.
                                </p>
                            </Grid.Column>
                            <Grid.Column floated="right" width={6}>
                                <Image
                                    bordered
                                    rounded
                                    size="large"
                                    src="/images/wireframe/white-image.png"
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column textAlign="center">
                                <Button inverted={inverted} size="huge">
                                    Check Them Out
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>

                <Segment className="noPadding" vertical>
                    <Grid celled="internally" columns="equal" stackable>
                        <Grid.Row textAlign="center">
                            <Grid.Column>
                                <Header as="h3" inverted={inverted}>
                                    "What a Company"
                                </Header>
                                <p>That is what they all say about us</p>
                            </Grid.Column>
                            <Grid.Column>
                                <Header as="h3" inverted={inverted}>
                                    "I shouldn't have gone with their competitor."
                                </Header>
                                <p>
                                    <Image avatar src="/images/avatar/large/nan.jpg" />
                                    <b>Nan</b> Chief Fun Officer Acme Toys
                                </p>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>

                <Segment vertical>
                    <Container text>
                        <Header as="h3" inverted={inverted}>
                            Breaking The Grid, Grabs Your Attention
                        </Header>
                        <p>
                            Instead of focusing on content creation and hard work, we have learned
                            how to master the art of doing nothing by providing massive amounts of
                            whitespace and generic content that can seem massive, monolithic and
                            worth your attention.
                        </p>
                        <Button as="a" inverted={inverted} size="large">
                            Read More
                        </Button>

                        <Divider as="h4" className="homePageDivider" horizontal inverted={inverted}>
                            Case Studies
                        </Divider>

                        <Header as="h3" inverted={inverted}>
                            Did We Tell You About Our Bananas?
                        </Header>
                        <p>
                            Yes I know you probably disregarded the earlier boasts as non-sequitur
                            filler content, but it's really true. It took years of gene splicing and
                            combinatory DNA research, but our bananas can really dance.
                        </p>
                        <Button as="a" inverted={inverted} size="large">
                            I'm Still Quite Interested
                        </Button>
                    </Container>
                </Segment>
            </Container>
        </DefaultLayout>
    )
}

export default Home

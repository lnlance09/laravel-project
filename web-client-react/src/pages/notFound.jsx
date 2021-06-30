import { DisplayMetaTags } from "utils/metaFunctions"
import { Container, Header } from "semantic-ui-react"
import DefaultLayout from "layouts/default"
import React, { Component } from "react"

class NotFound extends Component {
    render() {
        return (
            <div className="notFoundPage">
                <DisplayMetaTags page="notFound" />

                <DefaultLayout
                    activeItem=""
                    containerClassName="notFoundPage"
                    history={this.props.history}
                >
                    <Container textAlign="center">
                        <Header inverted size="large">
                            This page does not exist!
                        </Header>
                    </Container>
                </DefaultLayout>
            </div>
        )
    }
}

export default NotFound

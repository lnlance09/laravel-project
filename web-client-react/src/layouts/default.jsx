import { Container, Grid } from "semantic-ui-react"
import PageFooter from "components/Footer"
import PageHeader from "components/Header"
import PropTypes from "prop-types"
import React, { Fragment, useState } from "react"

const DefaultLayout = ({
    activeItem,
    children,
    containerClassName,
    history,
    isText,
    q,
    showFooter,
    showResults,
    textAlign,
    useGrid
}) => {
    const [searchMode, setSearchMode] = useState(false)

    return (
        <Fragment>
            {searchMode ? (
                <Container className="searchModeContainer">
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={13}></Grid.Column>
                            <Grid.Column width={3}>
                                <span
                                    className="closeSearchMode"
                                    onClick={() => setSearchMode(false)}
                                >
                                    Cancel
                                </span>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            ) : (
                <Fragment>
                    <PageHeader
                        history={history}
                        q={q}
                        showResults={showResults}
                        toggleSearchMode={() => setSearchMode(true)}
                    />

                    <Container className={`mainContainer ${containerClassName}`}>
                        {useGrid ? (
                            <Grid className="mainGrid" stackable>
                                <Grid.Column className="leftColumn" width={4}></Grid.Column>
                                <Grid.Column width={12}>{children}</Grid.Column>
                            </Grid>
                        ) : (
                            <Fragment>{children}</Fragment>
                        )}
                    </Container>

                    {showFooter && <PageFooter />}
                </Fragment>
            )}
        </Fragment>
    )
}

DefaultLayout.propTypes = {
    activeItem: PropTypes.string,
    children: PropTypes.node,
    containerClassName: PropTypes.string,
    history: PropTypes.object,
    isText: PropTypes.bool,
    q: PropTypes.string,
    showFooter: PropTypes.bool,
    showResults: PropTypes.bool,
    textAlign: PropTypes.string,
    useGrid: PropTypes.bool
}

DefaultLayout.defaultProps = {
    activeItem: "home",
    containerClassName: "",
    isText: false,
    q: "",
    showFooter: true,
    showResults: true,
    textAlign: "left",
    useGrid: true
}

export default DefaultLayout

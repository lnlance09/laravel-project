// import "./style.scss"
import { Form, Header, Image, Search } from "semantic-ui-react"
import _ from "lodash"
import defaultImg from "images/images/image-square.png"
import PropTypes from "prop-types"
import React, { Component } from "react"

const resultRenderer = ({ image, title }) => {
    return (
        <div className="searchItem">
            {image && (
                <Image
                    className="dropDownItemPic"
                    onError={(i) => (i.target.src = defaultImg)}
                    rounded={false}
                    src={image}
                />
            )}
            <Header inverted size="tiny">
                {title}
            </Header>
        </div>
    )
}

resultRenderer.propTypes = {
    description: PropTypes.string,
    image: PropTypes.string,
    social_media_id: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string,
    username: PropTypes.string
}

class NavSearch extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: false,
            results: [],
            value: props.defaultValue ? props.defaultValue : ""
        }
    }

    componentDidMount() {
        this.resetComponent()
    }

    fetchResults() {
        return fetch(
            `${window.location.origin}/api/search/basic?q=${this.state.value}&category=${
                this.props.category ? 1 : 0
            }`,
            {
                json: true
            }
        )
            .then((response) => {
                if (response.ok) {
                    response.json().then((data) => {
                        this.setState({
                            isLoading: false,
                            results: data.results
                        })
                    })
                }
            })
            .catch((err) => console.log(err))
    }

    handleSearchChange = (e, { value }) => {
        if (this.props.showResults) {
            const self = this
            this.setState({ isLoading: value.length > 3, value }, () => {
                setTimeout(() => {
                    self.fetchResults()
                }, 500)
            })
        } else {
            this.setState({ value })
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.props.history.push(`/search?q=${this.state.value}`)
    }

    onClick = (e, data) => {
        let link = `/pages/youtube/${data.result.social_media_id}`

        if (data.result.type === "twitter") {
            link = `/pages/twitter/${data.result.username}`
        }

        if (data.result.type === "tag") {
            link = `/tags/${data.result.slug}`
        }

        if (this.props.source === "header") {
            this.props.history.push(link)
        }

        if (this.props.source === "fallacyForm") {
            this.props.onChangeAssignee()
            this.props.selectAssignee({
                id: data.result.social_media_id,
                name: data.result.title,
                type: data.result.type,
                username: data.result.username
            })
            this.setState({ value: data.result.title })
        }
    }

    resetComponent = () =>
        this.setState({
            isLoading: false,
            results: [],
            value: this.props.defaultValue ? this.props.defaultValue : ""
        })

    render() {
        const { isLoading, results, value } = this.state

        const SearchBar = (props) => (
            <Search
                category={props.category}
                className="navSearch"
                defaultValue={value}
                disabled={props.disabled}
                loading={isLoading}
                minCharacters={4}
                onResultSelect={this.onClick}
                onSearchChange={_.debounce(this.handleSearchChange, 800, {
                    leading: true
                })}
                placeholder={props.placeholder}
                results={results}
                resultRenderer={resultRenderer}
                showNoResults={props.showResults}
                size={props.size}
            />
        )

        return (
            <div style={{ width: `${this.props.width}` }}>
                {this.props.source === "header" && (
                    <Form onSubmit={this.handleSubmit}>{SearchBar(this.props)}</Form>
                )}
                {this.props.source === "fallacyForm" && <div>{SearchBar(this.props)}</div>}
            </div>
        )
    }
}

NavSearch.propTypes = {
    category: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    defaultValue: PropTypes.string,
    disabled: PropTypes.bool,
    onChangeAssignee: PropTypes.func,
    placeholder: PropTypes.string,
    selectAssignee: PropTypes.func,
    showResults: PropTypes.bool,
    size: PropTypes.string,
    source: PropTypes.string,
    width: PropTypes.string
}

NavSearch.defaultProps = {
    category: true,
    disabled: false,
    placeholder: "Search",
    showResults: true,
    size: "big",
    source: "header",
    width: "420px"
}

export default NavSearch

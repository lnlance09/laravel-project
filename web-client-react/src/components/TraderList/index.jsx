import "./style.scss"
import { Card, Image, Label, Placeholder } from "semantic-ui-react"
import { formatPlural } from "utils/textFunctions"
import PlaceholderPic from "images/avatar/large/steve.jpg"
import PropTypes from "prop-types"

const TraderList = ({ inverted, loading, loadingMore, onClickTrader, traders }) => {
	const PlaceholderSegment = (
		<>
			<Placeholder className="placeholderPicWrapper" inverted={inverted} fluid>
				<Placeholder.Image />
			</Placeholder>
			<Card.Content>
				<Placeholder className="placeholderParagraphWrapper" inverted={inverted} fluid>
					<Placeholder.Paragraph>
						<Placeholder.Line />
						<Placeholder.Line />
						<Placeholder.Line />
					</Placeholder.Paragraph>
				</Placeholder>
			</Card.Content>
		</>
	)

	return (
		<div className="traderList">
			<Card.Group className={inverted ? "inverted" : ""} itemsPerRow={4} stackable>
				{traders.map((trader, i) => {
					const { accuracy, bio, img, name, predictionsCount, username } = trader
					return (
						<Card key={`trader${i}`} onClick={(e) => onClickTrader(e, username)}>
							{loading ? (
								<>{PlaceholderSegment}</>
							) : (
								<>
									<Image
										onError={(i) => (i.target.src = PlaceholderPic)}
										src={img}
									/>
									<Card.Content>
										<Card.Header>{name}</Card.Header>
										<Card.Meta>@{username}</Card.Meta>
										<Card.Description>{bio}</Card.Description>
									</Card.Content>
									<Card.Content extra>
										<Label
											basic
											className={inverted ? "inverted" : ""}
											color="green"
										>
											{accuracy.toFixed(2)}% accurate
										</Label>
										<Label
											basic
											className={inverted ? "inverted" : ""}
											color="blue"
										>
											{predictionsCount}{" "}
											{formatPlural(predictionsCount, "prediction")}
										</Label>
									</Card.Content>
								</>
							)}
						</Card>
					)
				})}
				{loadingMore && (
					<>
						<Card>{PlaceholderSegment}</Card>
						<Card>{PlaceholderSegment}</Card>
						<Card>{PlaceholderSegment}</Card>
						<Card>{PlaceholderSegment}</Card>
					</>
				)}
			</Card.Group>
		</div>
	)
}

TraderList.propTypes = {
	inverted: PropTypes.bool,
	loading: PropTypes.bool,
	loadingMore: PropTypes.bool,
	onClickTrader: PropTypes.func,
	traders: PropTypes.arrayOf(PropTypes.shape({}))
}

export default TraderList

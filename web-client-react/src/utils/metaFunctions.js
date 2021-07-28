import React from "react"
import MetaTags from "react-meta-tags"

export const DisplayMetaTags = ({ page, state }) => {
	const siteName = "Preditc"
	const description = `${siteName} is a social network that is used to share ideas and opinions about cryptocurrencies and their future performances`
	const img = ""
	let metaTags = {}

	switch (page) {
		case "":
			metaTags = {
				description,
				img,
				title: siteName
			}
			break
		case "about":
			metaTags = {
				description,
				img,
				title: `About - ${siteName}`
			}
			break
		case "applications":
			metaTags = {
				description,
				img,
				title: `My Applications - ${siteName}`
			}
			break
		case "coin":
			metaTags = {
				description: state.loaded ? state.coin.description : description,
				img: state.loaded ? state.coin.logo : img,
				title: state.loaded ? `${state.coin.name} - ${siteName}` : siteName
			}
			break
		case "coins":
			metaTags = {
				description: "Browse cryptocurrencies, tokens and coins on preditc.com",
				img,
				title: `Coins - ${siteName}`
			}
			break
		case "contact":
			metaTags = {
				description,
				img,
				title: `Contact Us - ${siteName}`
			}
			break
		case "prediction":
			metaTags = {
				description: state.predition.bio,
				img: state.prediction.img,
				title: state.loaded ? `${state.trader.name} - ${siteName}` : siteName
			}
			break
		case "predictions":
			metaTags = {
				description: "Browse cryptocurrency predictions on preditc.com",
				img,
				title: `Predictions - ${siteName}`
			}
			break
		case "rules":
			metaTags = {
				description,
				img,
				title: `Rules - ${siteName}`
			}
			break
		case "settings":
			metaTags = {
				description,
				img,
				title: `Settings - ${siteName}`
			}
			break
		case "signin":
			metaTags = {
				description,
				img,
				title: `Sign In - ${siteName}`
			}
			break
		case "sitemap":
			metaTags = {
				description,
				img,
				title: `Sitemap - ${siteName}`
			}
			break
		case "trader":
			metaTags = {
				description: state.loaded ? state.trader.bio : description,
				img: state.loaded ? state.trader.img : img,
				title: state.loaded ? `${state.trader.name} - ${siteName}` : siteName
			}
			break
		case "traders":
			metaTags = {
				description: "Browse some of the best cryptocurrency traders on preditc.com",
				img,
				title: `Traders - ${siteName}`
			}
			break
		default:
			metaTags = {
				description,
				img,
				title: ""
			}
	}

	return (
		<MetaTags>
			<title>{metaTags.title}</title>
			<meta name="description" content={metaTags.description} />
			<meta property="og:image" content={metaTags.img} />
		</MetaTags>
	)
}

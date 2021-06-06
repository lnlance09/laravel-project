import React from "react"
import MetaTags from "react-meta-tags"

export const DisplayMetaTags = ({ page, props, state }) => {
    const description =
        "Blather is a website and application that lets users assign logical fallacies to tweets. You can make political memes out of tweets and fallacies."
    const img = ""
    let metaTags = {}

    switch (page) {
        case "activity":
            metaTags = {
                description,
                img,
                title: "Activity"
            }
            break
        default:
            metaTags = {
                description,
                img,
                title: ""
            }
            break
    }

    return (
        <MetaTags>
            <title>{metaTags.title} - Blather</title>
            <meta name="description" content={metaTags.description} />
        </MetaTags>
    )
}

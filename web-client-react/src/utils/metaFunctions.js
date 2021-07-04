import React from "react"
import MetaTags from "react-meta-tags"

export const DisplayMetaTags = ({ page, props, state }) => {
    const description = ""
    const img = ""
    let metaTags = {}

    switch (page) {
        case "":
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
            <title>{metaTags.title} - Sample App</title>
            <meta name="description" content={metaTags.description} />
        </MetaTags>
    )
}

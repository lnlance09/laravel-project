import { useState } from "react"
import { parseJwt, setToken } from "utils/tokenFunctions"
import ThemeContext from "themeContext"

const ThemeProvider = ({ children }) => {
    let localData = parseJwt()
    const isInverted = typeof localData.inverted === "undefined" ? false : localData.inverted
    const [inverted, setInverted] = useState(isInverted)
    // console.log("Theme provider inverted", inverted)

    const toggleInverted = (e, value) => {
        setInverted(!value)
        setToken({
            inverted: !value
        })
    }

    return (
        <ThemeContext.Provider value={{ inverted, toggleInverted }}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeProvider

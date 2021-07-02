import { useState } from "react"
import ThemeContext from "themeContext"

const ThemeProvider = ({ children }) => {
    const [inverted, setInverted] = useState(false)

    const toggleInverted = (e, value) => {
        setInverted(!value)
    }

    return (
        <ThemeContext.Provider value={{ inverted, toggleInverted }}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeProvider

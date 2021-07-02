import { createContext } from "react"

const ThemeContext = createContext({
    inverted: false,
    toggleInverted: () => {}
})

export default ThemeContext

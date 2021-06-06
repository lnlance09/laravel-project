import React from "react"
import Moment from "react-moment"

const hoursOffset = new Date().getTimezoneOffset() / 60

export const adjustTimezone = (date) => {
    let dateStr = date
    if (typeof date !== "undefined" && date !== null) {
        dateStr = typeof Date.parse(date) !== "undefined" ? date.replace(/-/g, "/") : date
    }
    return new Date(dateStr).getTime() - hoursOffset * 3600000
}

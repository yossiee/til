import React from "react"
import containerStyles from "./container.module.css"

export default ({ children }) => (
    <div className={containerStyles.children}>{children}</div>
)

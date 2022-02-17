import React, { FC } from 'react'

import styles from './Layout.module.scss'

const Grid: FC<{}> = ({ children }) => {
    return <div className={styles.grid}>{children}</div>
}

export default Grid

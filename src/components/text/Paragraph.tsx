import React, { FC } from 'react'

import styles from './Text.module.scss'

const Paragraph: FC<{}> = ({ children }) => {
    return <div className={styles.p}>{children}</div>
}

export default Paragraph

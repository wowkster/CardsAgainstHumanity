import React, { FC } from 'react'

import styles from './Layout.module.scss'

const Col: FC<{

}> = ({
    children
}) => {
    return <div className={styles.col}>
        {children}
    </div>
}

export default Col
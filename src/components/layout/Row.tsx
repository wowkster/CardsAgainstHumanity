import React, { FC } from 'react'

import styles from './Layout.module.scss'

const Row: FC<{

}> = ({
    children
}) => {
    return <section className={styles.row}>
        {children}
    </section>
}

export default Row
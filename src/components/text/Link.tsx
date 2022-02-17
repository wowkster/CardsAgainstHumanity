import React, { FC } from 'react'
import NextLink from 'next/link'

import styles from './Text.module.scss'

const Link: FC<{
    href: string
}> = ({ href, children }) => {
    return (
        <NextLink href={href} passHref>
            <a className={styles.link}>{children}</a>
        </NextLink>
    )
}
export default Link

import React, { FC, HTMLAttributes } from 'react'
import { merge } from 'utils/styles'

import './Title.scss'

type TitleProps = {
    size: 'sm' | 'md' | 'lg' | 'xl'
} & HTMLAttributes<HTMLHeadingElement>

const Title: FC<TitleProps> = ({ size, className, children, ...rest }) => {
    switch (size) {
        case 'sm':
            return (
                <h4 className={merge(className, 'title')} {...rest}>
                    {children}
                </h4>
            )
        case 'md':
            return (
                <h3 className={merge(className, 'title')} {...rest}>
                    {children}
                </h3>
            )
        case 'lg':
            return (
                <h2 className={merge(className, 'title')} {...rest}>
                    {children}
                </h2>
            )
        case 'xl':
            return (
                <h1 className={merge(className, 'title')} {...rest}>
                    {children}
                </h1>
            )
    }
}

export default Title

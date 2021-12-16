import React, { AnchorHTMLAttributes, FC } from 'react'

import './Anchor.scss'

const Anchor: FC<AnchorHTMLAttributes<HTMLAnchorElement>> = (props) => {
    return <a {...props} className='anchor'>{props.children}</a>
}

export default Anchor
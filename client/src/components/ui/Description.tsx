import React, { FC } from 'react'

import './Description.scss'

const Description: FC = ({ children }) => {
    return <p className='description'>{children}</p>
}

export default Description

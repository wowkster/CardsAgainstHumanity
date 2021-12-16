import React, { FC, InputHTMLAttributes } from 'react'
import { merge } from 'utils/styles'

import './SubmitInput.scss'

type SubmitInputProps = {} & InputHTMLAttributes<HTMLInputElement>

const SubmitInput: FC<SubmitInputProps> = ({  className, ...rest }) => {
    return <input type='submit' className={merge(className, 'formInput__submit')} {...rest} />
}

export default SubmitInput

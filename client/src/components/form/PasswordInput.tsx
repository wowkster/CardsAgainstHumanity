import React, { FC, InputHTMLAttributes, useState } from 'react'

import './PasswordInput.scss'

type PasswordInputProps = {
    label: string
    id: string
    onChange: (value: string) => void
} & InputHTMLAttributes<HTMLInputElement>

const PasswordInput: FC<PasswordInputProps> = ({
    label,
    id,
    onChange,
    ...rest
}) => {
    const [value, setValue] = useState('')

    return (
        <label htmlFor={id} className='form__password'>
            {label}
            <input
                type='password'
                name={id}
                id={id}
                value={value}
                onChange={(evt) => {
                    setValue(evt.target.value)
                    onChange(evt.target.value)
                }}
                className='form__password__input'
                {...rest}
            />
            <span className='form__password__floating'>{label}</span>
        </label>
    )
}

export default PasswordInput

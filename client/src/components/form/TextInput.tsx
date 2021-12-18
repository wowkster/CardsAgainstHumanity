import React, { FC, InputHTMLAttributes, useState } from 'react'

import './TextInput.scss'

type TextInputProps = {
    label: string
    id: string
    onChange: (value: string) => void
} & InputHTMLAttributes<HTMLInputElement>

const TextInput: FC<TextInputProps> = ({ label, id, onChange, ...rest }) => {
    const [value, setValue] = useState('')

    return (
        <label htmlFor={id} className='form__text'>
            {label}
            <input
                type='text'
                name={id}
                id={id}
                value={value}
                onChange={(evt) => {
                    setValue(evt.target.value)
                    onChange(evt.target.value)
                }}
                className='form__text__input'
                {...rest}
            />
        </label>
    )
}

export default TextInput

import React, { FC, InputHTMLAttributes, useState } from 'react'

import './SwitchInput.scss'

type SwitchInputProps = {
    label: string
    id: string
    initial: boolean
    onChange: (value: boolean) => void
} & InputHTMLAttributes<HTMLInputElement>

const SwitchInput: FC<SwitchInputProps> = ({
    label,
    id,
    initial,
    onChange,
    ...rest
}) => {
    const [value, setValue] = useState<boolean>(initial)

    return (
        <label htmlFor={id} className='form__switch'>
            {label}
            <div className='form__switch__wrapper'>
                <input
                    type='checkbox'
                    value={`${value}`}
                    id={id}
                    name={id}
                    onChange={(evt) => {
                        const val = evt.target.value === 'true'

                        setValue(val)
                        onChange(val)
                    }}
                    className='form__switch__wrapper__checkbox'
                    {...rest}
                />
                <div className='form__switch__wrapper__slider'></div>
            </div>
        </label>
    )
}

export default SwitchInput

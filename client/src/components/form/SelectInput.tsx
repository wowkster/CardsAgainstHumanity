import React, { FC, InputHTMLAttributes, useState } from 'react'

import './SelectInput.scss'

type SelectInputProps = {
    label: string
    id: string
    options: SelectOption[]
    initial: SelectOption
    onChange: (value: SelectOption) => void
} & InputHTMLAttributes<HTMLSelectElement>

interface SelectOption {
    value: string
    label: string
}

const SelectInput: FC<SelectInputProps> = ({
    label,
    id,
    options,
    initial,
    onChange,
    ...rest
}) => {
    const [value, setValue] = useState<SelectOption>(initial)

    return (
        <label htmlFor={id} className='form__select'>
            {label}
            <div className='form__select__wrapper'>
                <select
                    className='form__select__wrapper__input'
                    name={id}
                    id={id}
                    value={value.value}
                    onChange={(evt) => {
                        const { value } = evt.target

                        const option = options.find((o) => o.value == value)

                        if (!option) throw new Error('Option was undefined!')

                        onChange(option)
                        setValue(option)
                    }}
                    {...rest}
                >
                    {options.map((o) => {
                        return <option value={o.value}>{o.label}</option>
                    })}
                </select>
            </div>
        </label>
    )
}

export default SelectInput

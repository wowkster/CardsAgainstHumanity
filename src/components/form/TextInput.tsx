import React, { FC } from 'react'

import styles from './Form.module.scss'

const TextInput: FC<{
    id: string
    placeholder: string
    value: string
    setValue: (value: string) => void
    filter?: (value: string) => string
}> = ({ id, placeholder, value, setValue, filter }) => {
    return (
        <input
            type='text'
            name={id}
            id={id}
            placeholder={placeholder}
            value={value}
            onChange={evt => {
                let { value } = evt.target

                if (filter) {
                    value = filter(value)
                }

                setValue(value)
            }}
            className={styles.textInput}
        />
    )
}

export default TextInput

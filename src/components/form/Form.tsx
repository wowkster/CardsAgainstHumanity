import React, { FC } from 'react'

import styles from './Form.module.scss'

const Form: FC<{
    onSubmit: () => void
}> = ({ onSubmit, children }) => {
    return (
        <form
            className={styles.form}
            onSubmit={evt => {
                evt.preventDefault()
                onSubmit()
            }}>
            {children}
        </form>
    )
}

export default Form

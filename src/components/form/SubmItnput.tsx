import React, { FC } from 'react'

import styles from './Form.module.scss'

const SubmitInput: FC<{
    id?: string
    text: string
}> = ({
    id,
    text
}) => {
    return <input
    type='submit'
    id={id}
    value={text}
    className={styles.submit}
/>
}

export default SubmitInput
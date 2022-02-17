import React, { FC } from 'react'

import styles from './Form.module.scss'

const FormRow: FC<{

}> = ({
    children
}) => {
    return <section className={styles.group__row}>
        {children}
    </section>
}

export default FormRow
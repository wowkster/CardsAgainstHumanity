import React from 'react'
import { Helmet } from 'react-helmet'

interface Props {
    title?: string
    description?: string
}

const Layout: React.FC<Props> = (props) => {
    const {
        children,
        title = 'React App',
        description = 'Web site created using create-react-app'
    } = props

    return (
        <>
            <Helmet>
                <meta charSet='utf-8' />
                <title>{title}</title>
                <meta name='description' content={description} />
            </Helmet>

            {children}
        </>
    )
}

export { Layout }

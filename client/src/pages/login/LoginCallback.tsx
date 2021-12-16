import React, { FC, useEffect, useState } from 'react'

import './Login.scss'

const LoginCallback: FC<{}> = ({}) => {
    const [error, setError] = useState(false)
    
    console.log(window.opener)

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')

        if (!code) return setError(true)

        window.localStorage.setItem('code', `${code}`)
    }, [])

    return (error ? <div>An error occured!</div> : <div>Redirecting back to app...</div>)
}

export default LoginCallback

import axios from 'axios'
import { useAuth } from 'hooks'
import React, { FC, Suspense, useEffect } from 'react'
import { useRoutes } from 'react-router-dom'
import routes from 'routes'
import 'styles/App.scss'
import { wrapPromise } from 'utils'

async function fetchUser() {
    try {
        const res = await axios.get('/api/v1/user/@me', {withCredentials: true})
        const { data } = res
        return data ?? null
    } catch {
        return null
    }
}

const initUser = wrapPromise(fetchUser())

const App = () => {
    return (
        <Suspense fallback='loading...'>
            <Routing />
        </Suspense>
    )
}

const Routing: FC<{}> = ({}) => {
    const {setUser} = useAuth()

    const user = initUser.read()
    console.log('Suspense User:', user)

    if (user) setUser(user)

    const routing = useRoutes(routes(!!user))

    console.log('Suspense Logged In:', !!user)

    return routing
}

export default App

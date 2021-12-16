import axios from 'axios'
import { useAuth } from 'hooks'
import React, { FC, FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import './Login.scss'
import { ErrorDisplay } from './LoginLayout'

const UsernamePrompt: FC<{}> = ({}) => {
    const goTo = useNavigate()
    const { user, setUser } = useAuth()
    const [usernameValue, setUsernameValue] = useState(user?.username)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!user) goTo('/login')
        if (user?.usernameHasInit) goTo('/')
    }, [])

    const handleSubmit = async (evt: FormEvent) => {
        evt.preventDefault()

        // Create new user account
        const res = await axios.post('/api/v1/user/edit', {
            username: usernameValue
        })
        const { data: user } = res
        console.log(user)
        setUser(user)

        goTo('/')
    }

    return (
        <React.Fragment>
            <h2 className='login__title'>Select a Username</h2>
            <form className='login__form' onSubmit={handleSubmit}>
                {error && <ErrorDisplay error={error} />}
                <label htmlFor='email' className='login__form__label'>
                    Username
                    <input
                        type='text'
                        name='username'
                        id='username'
                        value={usernameValue}
                        onChange={(evt) => setUsernameValue(evt.target.value)}
                        placeholder='Wowkster'
                        required
                    />
                </label>
                <input
                    type='submit'
                    value={'Submit'}
                    className='login__form__submit'
                />
            </form>
        </React.Fragment>
    )
}

export default UsernamePrompt

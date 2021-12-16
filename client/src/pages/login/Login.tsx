import React, { FC, useEffect, useState } from 'react'

import './Login.scss'
import axios, { AxiosError } from 'axios'
import { useAuth } from 'hooks'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import { LoginForm, OAuthButtons } from './LoginLayout'

const Login: FC<{}> = ({}) => {
    const { user, setUser } = useAuth()
    const goTo = useNavigate()
    const [error, setError] = useState('')

    useEffect(() => {
        if (user) goTo('/')
    }, [])

    const onFormSubmit = async (email, password) => {
        setError('')
        try {
            const res = await axios.post('/api/v1/auth/login', {
                email,
                password
            })
            console.log(res)
            const { data: user } = res
            setUser(user)

            goTo('/')
        } catch (err) {
            if (!axios.isAxiosError(err)) console.error(err)
            const { response: res } = err as AxiosError

            const msg =
                res?.data.message ||
                'An unkown error occured during the request!'
            setError(msg)
        }
    }

    return (
        <React.Fragment>
            <h2 className='login__title'>Log In</h2>
            <LoginForm onSubmit={onFormSubmit} error={error}/>
            <hr className='login__rule' />
            <div className='login__buttons'>
                <OAuthButtons />
            </div>
            <p className='login__footnote'>
                Don't have an account?{' '}
                <Link to={'/login/register'} className='login__footnote__link'>
                    Sign Up
                </Link>
                <br />
                <br />
                <Link to={'/login/reset_password'} className='login__footnote__link'>
                    Forgot Password?
                </Link>
            </p>
        </React.Fragment>
    )
}

export default Login

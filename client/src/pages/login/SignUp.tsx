import axios, { Axios, AxiosError } from 'axios'
import { useAuth } from 'hooks'
import React, { FC, FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import './Login.scss'
import { ErrorDisplay, LoginForm, OAuthButtons } from './LoginLayout'

const SignUp: FC<{}> = ({}) => {
    const { user, setUser } = useAuth()
    const goTo = useNavigate()
    const [error, setError] = useState('')

    useEffect(() => {
        if (user) goTo('/')
    }, [])

    const onFormSubmit = async (email, password) => {
        // Create new user account
        setError('')
        try {
            const res = await axios.post('/api/v1/auth/signup', {
                email,
                password
            })

            const { data: user } = res
            setUser(user)

            // Prompt for username (api will create one by default)
            goTo('/login/username')
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
            <h2 className='login__title'>Sign Up</h2>
            <LoginForm onSubmit={onFormSubmit} error={error} signup />
            <hr className='login__rule' />
            <div className='login__buttons'>
                <OAuthButtons />
            </div>

            <p className='login__footnote'>
                Already have an account?{' '}
                <Link to={'/login'} className='login__footnote__link'>
                    Log In
                </Link>
                <br />
                <br />
                By signing up you agree to our{' '}
                <Link to={'/terms'} className='login__footnote__link'>
                    Terms and Conditions
                </Link>{' '}
                as well as our{' '}
                <Link to={'/privacy'} className='login__footnote__link'>
                    Privacy Policy
                </Link>
            </p>
        </React.Fragment>
    )
}

export default SignUp

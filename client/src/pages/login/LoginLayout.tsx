import React, {
    FC,
    useState,
    MouseEvent,
    useEffect,
    FormEvent,
    useRef
} from 'react'

import logo from '../../images/logo.png'
import './Login.scss'
import { Outlet, useNavigate } from 'react-router-dom'
import GoogleLogin from 'react-google-login'
import DiscordOAuth2 from 'discord-oauth2'
import { useAuth } from 'hooks'
import axios from 'axios'
import { FaDiscord } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { BiMessageError } from 'react-icons/bi'

const Login: FC<{}> = ({}) => {
    return (
        <div className={'page'}>
            <div className='login'>
                <img
                    src={logo}
                    alt='Cards Against Humanity Logo'
                    className='login__logo'
                />
                <Outlet />
            </div>
        </div>
    )
}

export const LoginForm: FC<{
    onSubmit: (email: string, password: string) => void
    signup?: boolean
    error?: string
}> = ({ onSubmit, signup, error }) => {
    const [emailValue, setEmailValue] = useState('')
    const [passwordValue, setPasswordValue] = useState('')
    const [repeatPasswordValue, setRepeatPasswordValue] = useState('')
    const [repeatError, setRepeatError] = useState('')

    const handleSubmit = (evt: FormEvent) => {
        evt.preventDefault()
        setRepeatError('')

        if (signup) {
            if (passwordValue !== repeatPasswordValue) {
                setRepeatError('Passwords must match!')
                return
            }
        }

        onSubmit(emailValue, passwordValue)
    }

    return (
        <form className='login__form' onSubmit={handleSubmit}>
            {repeatError && <ErrorDisplay error={repeatError} />}
            {error && <ErrorDisplay error={error} />}
            <label htmlFor='email' className='login__form__label'>
                Email
                <input
                    type='email'
                    name='email'
                    id='email'
                    value={emailValue}
                    onChange={(evt) => setEmailValue(evt.target.value)}
                    placeholder='email@example.com'
                    required
                />
            </label>
            <label htmlFor='password' className='login__form__label'>
                Password
                <input
                    type='password'
                    name='password'
                    id='password'
                    value={passwordValue}
                    onChange={(evt) => setPasswordValue(evt.target.value)}
                    placeholder='P4$$w0rd1'
                    required
                />
            </label>
            {signup && (
                <label htmlFor='repeatPassword' className='login__form__label'>
                    Repeat Password
                    <input
                        type='password'
                        name='repeatPassword'
                        id='repeatPassword'
                        value={repeatPasswordValue}
                        onChange={(evt) =>
                            setRepeatPasswordValue(evt.target.value)
                        }
                        placeholder='P4$$w0rd1'
                        required
                    />
                </label>
            )}

            <input
                type='submit'
                value={signup ? 'Create Account' : 'Sign In'}
                className='login__form__submit'
            />
        </form>
    )
}

export const ErrorDisplay: FC<{
    error: string
}> = ({ error }) => {
    return (
        <div className='login__form__error'>
            {' '}
            <BiMessageError size={24} /> <div>{error}</div>
        </div>
    )
}

export const OAuthButtons: FC<{}> = ({}) => {
    const { setUser } = useAuth()
    const goTo = useNavigate()

    const handleGoogleLogin = async (googleData) => {
        const res = await axios.post('/api/v1/auth/google', {
            token: googleData.tokenId
        })
        const { data: user } = res
        console.log(res)
        console.log(user)
        setUser(user)

        if (res.status === 201) {
            console.log('User is new! Prompting for username...')
            goTo('/login/username')
        } else {
            console.log('User is not new! Sending to homepage...')
            goTo('/')
        }
    }

    const handleDiscordLogin = async (code?) => {
        console.log('Sending auth request with code:', code)
        const res = await axios.post('/api/v1/auth/discord', {
            code
        })
        const { data: user } = res
        console.log(user)
        setUser(user)

        if (res.status === 201) {
            goTo('/login/username')
        } else {
            goTo('/')
        }
    }

    return (
        <React.Fragment>
            <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID ?? ''}
                buttonText='Log in with Google'
                onSuccess={handleGoogleLogin}
                onFailure={handleGoogleLogin}
                cookiePolicy={'single_host_origin'}
                render={(renderProps) => (
                    <button
                        onClick={renderProps.onClick}
                        disabled={renderProps.disabled}
                        className='login__buttons__google'
                    >
                        <FcGoogle size={24} /> Continue With Google
                    </button>
                )}
            />
            <DiscordLogin
                clientId={process.env.REACT_APP_DISCORD_CLIENT_ID ?? ''}
                onSuccess={handleDiscordLogin}
                onFailure={handleDiscordLogin}
            />
        </React.Fragment>
    )
}

const DiscordLogin: FC<{
    clientId: string
    onSuccess: (code: string) => void
    onFailure: () => void
}> = ({ clientId, onSuccess, onFailure }) => {
    const [loading, setLoading] = useState(false)

    const discordOAuth = new DiscordOAuth2({
        clientId,
        redirectUri: 'http://localhost:3000/login/callback'
    })

    const createPopup = usePopup({
        height: 800,
        url: discordOAuth.generateAuthUrl({
            scope: ['identify', 'email']
        }),
        title: 'Discord Login',
        onCode(code) {
            return code ? onSuccess(code) : onFailure()
        }
    })

    const handleClick = (evt: MouseEvent) => {
        setLoading(true)
        createPopup()
    }

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className='login__buttons__discord'
        >
            <FaDiscord size={24} color='#fff' /> Continue With Discord
        </button>
    )
}

interface UsePropOptions {
    width?: number
    height?: number
    url?: string
    title?: string
    onClose?: () => any
    onCode: (code: string | null) => any
}

function usePopup(options: UsePropOptions) {
    const externalWindow = useRef<Window | null>()

    useEffect(() => {
        return () => {
            externalWindow.current?.close()
        }
    }, [])

    return () => {
        options.width = options.width ?? 500
        options.height = options.height ?? 500
        options.url = options.url ?? ''
        options.title = options.title ?? ''

        const { url, title, width, height, onCode, onClose } = options

        const left = window.screenX + (window.outerWidth - width) / 2
        const top = window.screenY + (window.outerHeight - height) / 2.5

        const windowFeatures = `toolbar=0,scrollbars=1,status=1,resizable=0,location=1,menuBar=0,width=${width},height=${height},top=${top},left=${left}`

        externalWindow.current = window.open(url, title, windowFeatures)
        console.log(externalWindow.current)

        const storageListener = () => {
            try {
                let code = localStorage.getItem('code')

                if (code) {
                    console.log('Got code:', code)
                    externalWindow.current?.close()
                    onCode(code)
                    window.removeEventListener('storage', storageListener)
                }
            } catch (e) {
                window.removeEventListener('storage', storageListener)
            }
        }

        window.addEventListener('storage', storageListener)

        externalWindow.current?.addEventListener(
            'beforeunload',
            () => {
                console.log('Closing Window')
                console.log(externalWindow)
                onClose?.()
            },
            false
        )
    }
}

export default Login

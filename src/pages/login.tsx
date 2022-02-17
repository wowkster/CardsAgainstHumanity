import React, { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { FcGoogle } from 'react-icons/fc'
import { AiFillGithub } from 'react-icons/ai'
import { FaDiscord } from 'react-icons/fa'

import { combine } from '../util/styles'
import { getSession, getProviders } from '../lib/fastifyAuth/fastifyAuthServer'
import { SSRContext, OAuthProvider } from '../lib/fastifyAuth/fastifyAuth'
import { signIn } from '../lib/fastifyAuth/fastifyAuthClient'

import logo from '../images/logo.png'

import styles from '../styles/Login.module.scss'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'

// TODO Add some cool svg animations like discord login
const LoginPage: FC<{
    providers: OAuthProvider[]
}> = ({ providers }) => {
    const router = useRouter()

    return (
        <div className={styles.page_container}>
            <div className={styles.login}>
                <Image src={logo} width={250 * 1.1} height={105 * 1.1} layout='fixed' />
                <h2>Log In</h2>
                <div className={styles.login__buttons}>
                    {Object.values(providers).map(provider => (
                        <button
                            key={provider.id}
                            className={combine(
                                styles.login__provider,
                                provider.id === 'google' && styles.login__provider__google,
                                provider.id === 'github' && styles.login__provider__github,
                                provider.id === 'discord' && styles.login__provider__discord
                            )}
                            onClick={() => {
                                signIn(provider, router)
                            }}>
                            {provider.id === 'google' && <FcGoogle size={28} />}
                            {provider.id === 'github' && <AiFillGithub size={28} />}
                            {provider.id === 'discord' && <FaDiscord size={28} />}
                            Sign in with {provider.name}
                        </button>
                    ))}
                </div>
                <br />
                <p>
                    By signing up you agree to the{' '}
                    <Link href={'/terms'} passHref>
                        <span className={styles.link}>Terms and Conditions</span>
                    </Link>
                </p>
            </div>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context: SSRContext) => {
    const session = await getSession(context)

    if (session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    const providers = getProviders()

    // console.log('Providers:', providers)

    return {
        props: { providers: providers ?? [] },
    }
}

export default LoginPage

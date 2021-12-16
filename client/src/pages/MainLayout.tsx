import { Layout } from 'components'
import React, { FC } from 'react'
import { AiFillCaretDown } from 'react-icons/ai'
import { Outlet } from 'react-router'
import logoOnly from '../images/logoOnly.png'
import profile from '../images/profile.png'

import './MainLayout.scss'

const MainLayout: FC = () => {
    return (
        <div className='page-container'>
            <div className='content-wrap'>
                <nav className='nav'>
                    <div className='nav__logo'>
                        <img src={logoOnly} alt='Logo' />
                        <h2>Cards Against The Internet</h2>
                    </div>
                    <div className='nav__profile'>
                        <div className='nav__profile__img' data-notification>
                            <img src={profile} alt='Profile Avatar' />
                        </div>
                        <AiFillCaretDown />
                    </div>
                </nav>
                <main className='main'>
                    <Outlet />
                </main>
            </div>
            <footer className='footer'>
                &copy; 2021 Wowkster. All rights reserved.
            </footer>
        </div>
    )
}

export default MainLayout

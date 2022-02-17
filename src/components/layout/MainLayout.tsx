import React, { FC } from 'react'
import Image from 'next/image'
import { AiFillCaretDown } from 'react-icons/ai'
import logoOnly from '../../images/logoOnly.png'
import profile from '../../images/profile.png'

import styles from './MainLayout.module.scss'

const MainLayout: FC = ({ children }) => {
    return (
        <div className={styles.page_container}>
            <div className={styles.content_wrapper}>
                <nav className={styles.nav}>
                    <div className={styles.nav__logo}>
                        <Image src={logoOnly} alt='Logo' layout='fixed' width={1124*0.15} height={630*0.15} />
                        <h2>Cards Against Humanity Online</h2>
                    </div>
                    <div className={styles.nav__profile} aria-label='User Profile Menu'>
                        <div className={styles.nav__profile__img} data-notification>
                            <Image src={profile} alt='Profile Avatar' layout='fixed' width={60} height={60} />
                        </div>
                        <AiFillCaretDown size={24} />
                    </div>
                </nav>
                <main className={styles.main}>{children}</main>
            </div>
            <footer className={styles.footer}>&copy; 2022 Wowkster. All rights reserved.</footer>
        </div>
    )
}

export default MainLayout

import { Layout } from 'components'
import Anchor from 'components/ui/Anchor'
import Description from 'components/ui/Description'
import Title from 'components/ui/Title'
import React from 'react'

import './Home.scss'

import TextInput from 'components/form/TextInput'
import SubmitInput from 'components/form/SubmitInput'
import JoinYourFriends from './JoinYourFriends'
import CreateRoom from './CreateRoom'
import PublicRooms from './PublicRooms'

const Home: React.FC = () => {
    return (
        <Layout
            title='Home - CAH Online'
            description='The ultimate way to play Cards Against Humanity online!'
        >
            <div className='home-wrapper'>
                <div className='home'>
                    <section className='home__hero'>
                        <article>
                            <Title size={'xl'}>
                                Cards Against The Internet!
                            </Title>
                            <Description>
                                Cards Against The Internet is a web version of
                                the very popular game “Cards Against Humanity”.
                                There are a few others that exist, but I found
                                they were very lackluster and actually had a lot
                                of room for improvement. I set out to create an
                                authentic experience online with an actually
                                pleasant looking interface, and convenient
                                features like user accounts and settings! All
                                the code for this project can be found on my{' '}
                                <Anchor href='https://github.com/wowkster/CardsAgainstHumanity'>
                                    GitHub profile
                                </Anchor>
                                .
                            </Description>
                        </article>
                        <section>
                            <Title size='lg'>Join Your Friends!</Title>
                            <Description>
                                If your friends sent you an invite link or
                                invite code, enter it here
                            </Description>
                            <JoinYourFriends />
                        </section>
                    </section>
                    <aside className='home__create'>
                        <Title size='lg'>Create a Game</Title>
                        <Description>
                            Create your own room and wait for people to join, or
                            invite your friends!
                        </Description>
                        <CreateRoom />
                    </aside>
                    <section className='home__public'>
                        <Title size='lg'>Public Rooms</Title>
                        <Description>
                            Create your own room and wait for people to join, or
                            invite your friends!
                        </Description>
                        <PublicRooms />
                    </section>
                </div>
            </div>
        </Layout>
    )
}

export default Home

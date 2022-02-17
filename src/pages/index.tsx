import React, { FC, useState } from 'react'
import Col from '../components/layout/Col'
import Grid from '../components/layout/Grid'
import Link from '../components/text/Link'
import MainLayout from '../components/layout/MainLayout'
import Paragraph from '../components/text/Paragraph'
import Row from '../components/layout/Row'
import Form from '../components/form/Form'
import TextInput from '../components/form/TextInput'
import SubmitInput from '../components/form/SubmItnput'
import FormRow from '../components/form/FormRow'

enum RoomStatus {
    QUEUING,
    STARTED,
    FULL,
}

interface Room {
    id: string
    owner: {
        id: string
        username: string
        avatarUrl: string
    }
    players: {
        users: {
            id: string
            username: string
        }[]
        max: number
    }
    spectators: {
        users: {
            id: string
            username: string
        }[]
        max: number
    }
    status: RoomStatus
}

const Home: FC<{}> = ({}) => {
    const [joinLinkContent, setJoinLinkContent] = useState('')
    const [roomSearchContent, setRoomSearchContent] = useState('')
    const [rooms, setRooms] = useState<Room[]>([])

    const handleJoinLinkSubmit = () => {
        if (!joinLinkContent) return

        console.log(joinLinkContent)
        setJoinLinkContent('')
    }

    const handleRoomSearch = () => {}

    return (
        <MainLayout>
            <Row>
                <Col>
                    <h1>Welcome to Cards Against Humanity Online!</h1>
                    <Paragraph>
                        Cards Against The Internet is a web version of the very popular game “Cards Against Humanity”.
                        There are a few others that exist, but I found they were very lackluster and actually had a lot
                        of room for improvement. I set out to create an authentic experience online with an actually
                        pleasant looking interface, and convenient features like user accounts and settings! All the
                        code for this project can be found on my
                        <Link href='https://github.com/wowkster/CardsAgainstHumanity'>GitHub</Link> profile.
                    </Paragraph>
                    <h2>Join Your Friends!</h2>
                    <Paragraph>If your friends sent you an invite link or invite code, enter it here</Paragraph>
                    <Form onSubmit={handleJoinLinkSubmit}>
                        <FormRow>
                            <TextInput
                                id={'joinLink'}
                                placeholder={'i.e. LIKHGFQE'}
                                value={joinLinkContent}
                                setValue={setJoinLinkContent}
                                filter={v => v.replace(/[^A-Za-z]/gi, '').toUpperCase()}
                            />
                            <SubmitInput text={'Join!'} />
                        </FormRow>
                    </Form>
                </Col>
                <Col>
                    <h2>Create a Game</h2>
                    <Paragraph>Create your own room and wait for people to join, or invite your friends!</Paragraph>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h2>Public Rooms</h2>
                    <Form onSubmit={handleRoomSearch}>
                        <FormRow>
                            <TextInput
                                id={'roomSearch'}
                                placeholder={'Search'}
                                value={roomSearchContent}
                                setValue={setRoomSearchContent}
                            />
                            <SubmitInput text={'Find'} />
                        </FormRow>
                    </Form>
                </Col>
                <Col></Col>
            </Row>
            <Row>
                <Grid>
                    <p>this is some text</p>
                    <p>this is some text</p>
                    <p>this is some text</p>
                    <p>this is some text</p>
                    <p>this is some text</p>
                    <p>this is some text</p>
                    <p>this is some text</p>
                    <p>this is some text</p>
                    <p>this is some text</p>
                </Grid>
            </Row>
        </MainLayout>
    )
}

export default Home

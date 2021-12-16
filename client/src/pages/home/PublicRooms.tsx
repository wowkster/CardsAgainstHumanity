import TextInput from 'components/form/TextInput'
import Title from 'components/ui/Title'
import { useAuth } from 'hooks'
import { FC } from 'react'
import { User } from 'types/User'
import '../../utils/strings'

import './PublicRooms.scss'

const PublicRooms: FC<{}> = ({}) => {
    const { user } = useAuth()
    if (!user) throw new Error('User is not defined')

    return (
        <div className='rooms'>
            <form className='rooms__search'>
                <TextInput
                    label={''}
                    id={'roomSearch'}
                    onChange={() => {}}
                    placeholder='Search'
                />
            </form>
            <div className='rooms__listings'>
                <RoomListing
                    owner={user}
                    status={QueueStatus.QUEUING}
                    maxPlayers={8}
                    players={[user, user, user, user]}
                    spectators={[]}
                    roomCode={''}
                />
                <RoomListing
                    owner={user}
                    status={QueueStatus.STARTED}
                    maxPlayers={8}
                    players={[user,]}
                    spectators={[]}
                    roomCode={''}
                />
                <RoomListing
                    owner={user}
                    status={QueueStatus.FULL}
                    maxPlayers={8}
                    players={[user, user, user, user]}
                    spectators={[]}
                    roomCode={''}
                />
            </div>
        </div>
    )
}

enum QueueStatus {
    QUEUING = 'Queuing',
    STARTED = 'Started',
    FULL = 'Full'
}

interface RoomListingProps {
    owner: User
    status: QueueStatus
    maxPlayers: number
    players: User[]
    spectators: User[]

    roomCode: string
}

const RoomListing: FC<RoomListingProps> = ({
    owner,
    status,
    maxPlayers,
    players,
    spectators,
    roomCode
}) => {
    const handleJoinClick = () => {
        console.log(roomCode)
    }
    const handleSpectateClick = () => {}

    return (
        <div className='rooms__listing'>
            <img
                src={owner.avatarUrl}
                alt='Profile Image'
                className='rooms__listing__avatar'
            />
            <div
                className='rooms__listing__data'
                data-status={status.toLowerCase()}
            >
                <Title size={'sm'} className='rooms__listing__data__title'>
                    {owner.username.toPossessive()} Room
                </Title>
                <hr className='rooms__listing__data__rule' />
                <p className='rooms__listing__data__players'>
                    {players.length}/{maxPlayers} Players:{' '}
                    {players.map((u) => u.username).joinNicely()}
                </p>
                <p className='rooms__listing__data__status'>{status}</p>
            </div>
            <div className='rooms__listing__buttons'>
                <button
                    onClick={handleJoinClick}
                    className='rooms__listing__buttons__join'
                    disabled={players.length >= maxPlayers}
                >
                    Join
                </button>
                <button
                    onClick={handleSpectateClick}
                    className='rooms__listing__buttons__watch'
                >
                    Watch
                </button>
            </div>
        </div>
    )
}

export default PublicRooms

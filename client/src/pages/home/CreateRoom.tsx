import Title from 'components/ui/Title'
import React, { FC } from 'react'

import './CreateRoom.scss'

const CreateRoom: FC<{}> = ({}) => {
    return (
        <form className='create-room'>
            <div>
                <div>
                    <Title size={'md'} className='create-room__title'>Room Settings</Title>
                    <label htmlFor='maxPlayers'>
                        Max Players
                        <input
                            type='number'
                            name='maxPlayers'
                            id='maxPlayers'
                        />
                    </label>
                    <label htmlFor='maxScore'>
                        Score Limit
                        <input type='number' name='maxScore' id='maxScore' />
                    </label>
                    <label htmlFor='maxSpectators'>
                        Spectator Limit
                        <input
                            type='number'
                            name='maxSpectators'
                            id='maxSpectators'
                        />
                    </label>
                    <label htmlFor='privateRoom'>
                        Spectator Limit
                        <input
                            type='checkbox'
                            name='privateRoom'
                            id='privateRoom'
                        />
                    </label>
                    <input
                        type='password'
                        name='roomPassword'
                        id='roomPassword'
                        placeholder='TacoKat-345'
                    />
                </div>
                <div>
                    <h3>Card Packs</h3>

                    <div>
                        <label htmlFor='baseGame'>
                            Base Game (US)
                            <input
                                type='checkbox'
                                name='baseGame'
                                id='baseGame'
                            />
                        </label>
                    </div>
                </div>
            </div>
            <input type='submit' value='Create Room' />
        </form>
    )
}

export default CreateRoom

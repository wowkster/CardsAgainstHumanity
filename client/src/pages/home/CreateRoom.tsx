import PasswordInput from 'components/form/PasswordInput'
import SelectInput from 'components/form/SelectInput'
import SubmitInput from 'components/form/SubmitInput'
import SwitchInput from 'components/form/SwitchInput'
import Title from 'components/ui/Title'
import React, { FC } from 'react'

import './CreateRoom.scss'

const PLAYER_MAXIMUMS = [
    {
        value: '3',
        label: '3'
    },
    {
        value: '4',
        label: '4'
    },
    {
        value: '5',
        label: '5'
    },
    {
        value: '6',
        label: '6'
    },
    {
        value: '7',
        label: '7'
    },
    {
        value: '8',
        label: '8'
    },
    {
        value: '9',
        label: '9'
    },
    {
        value: '10',
        label: '10'
    }
]

const SCORE_MAXIMUMS = [
    {
        value: '4',
        label: '4'
    },
    {
        value: '8',
        label: '8'
    },
    {
        value: '12',
        label: '12'
    },
    {
        value: '16',
        label: '16'
    },
    {
        value: '20',
        label: '20'
    },
    {
        value: 'unlimited',
        label: 'Unlimited'
    }
]

const SPECTATOR_MAXIMUMS = [
    {
        value: '0',
        label: '0'
    },
    {
        value: '4',
        label: '4'
    },
    {
        value: '8',
        label: '8'
    },
    {
        value: '12',
        label: '12'
    },
    {
        value: '24',
        label: '24'
    },
    {
        value: 'unlimited',
        label: 'Unlimited'
    }
]

const CreateRoom: FC<{}> = ({}) => {
    return (
        <form className='create-room'>
            <div className='options'>
                <div className='options__settings'>
                    <Title size={'md'} className='options__settings__title'>
                        Room Settings
                    </Title>
                    <div className='options__settings__inputs'>
                        <SelectInput
                            label={'Max Players'}
                            id={'maxPlayers'}
                            options={PLAYER_MAXIMUMS}
                            initial={{
                                value: '8',
                                label: '8'
                            }}
                            onChange={() => {}}
                        />
                        <SelectInput
                            label={'Score Limit'}
                            id={'maxScore'}
                            options={SCORE_MAXIMUMS}
                            initial={{
                                value: '12',
                                label: '12'
                            }}
                            onChange={() => {}}
                        />
                        <SelectInput
                            label={'Spectator Limit'}
                            id={'maxSpectators'}
                            options={SPECTATOR_MAXIMUMS}
                            initial={{
                                value: '12',
                                label: '12'
                            }}
                            onChange={() => {}}
                        />
                        <SwitchInput
                            label={'Private Room'}
                            id={'privateRoom'}
                            initial={false}
                            onChange={() => {}}
                        />

                        <PasswordInput label={'Password'} id={'roomPassword'} onChange={() => {}}/>
                    </div>
                </div>
                <div className='options__packs'>
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
            <SubmitInput value={'Create Room'} className='options__submit'/>
            <input type='submit' value='Create Room' />
        </form>
    )
}

export default CreateRoom

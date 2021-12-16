import SubmitInput from 'components/form/SubmitInput'
import TextInput from 'components/form/TextInput'
import React, { FC } from 'react'

import './JoinYourFriends.scss'

const JoinYourFriends: FC = () => {
    return <form className='join-your-friends'>
    <TextInput
        label={''}
        id={'inviteLink'}
        onChange={() => {}}
        placeholder='cahonline.io/room/LIKHGFQE or LIKHGFQE'
        maxLength={32}
    />
    <SubmitInput value={'Join!'} className='join-your-friends__button'/>
</form>
}

export default JoinYourFriends
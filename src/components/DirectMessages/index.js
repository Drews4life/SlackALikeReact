import React, { useState, useEffect } from 'react'
import { 
    Menu,
    Icon,
} from 'semantic-ui-react'
import useLoadUsers from '../../effects/useLoadUsers'
import { connect } from 'react-redux'
import { setCurrentChannel, setPrivateChannel } from '../../store/actions'

const DirectMessages = ({
    users = [], 
    user,
    setCurrentChannel,
    setPrivateChannel,
}) => {

    const loadedUsers = useLoadUsers(user)
    const [activeChannel, setActiveChannel] = useState("")

    const getChannelId = userId => {
        const currUserId = user.uid
        return userId < currUserId ? `${userId}/${currUserId}` : `${currUserId}/${userId}`
    }

    const changeChannel = user => {
        const channelId = getChannelId(user.uid)

        const channelData = {
            id: channelId,
            name: user.name
        }

        setActiveChannel(user.uid)
        setCurrentChannel(channelData)
        setPrivateChannel(true)
    }

    return (
        <Menu.Menu>
            <Menu.Item>
                <span>
                    <Icon name="mail"/> DIRECT MESSAGES 
                </span>&nbsp;
                ({users.length})
            </Menu.Item>
            {
                loadedUsers.map(loadedUser => (
                    <Menu.Item 
                        key={loadedUser.uid}
                        active={activeChannel === loadedUser.uid}
                        onClick={() => changeChannel(loadedUser)}    
                        style={{ opacity: .7, fontStyle: "italic" }}
                    >
                        <Icon 
                            name="circle"
                            color={loadedUser.status === 'online' ? 'green' : 'red'}
                        />
                        @ {loadedUser.name}
                    </Menu.Item>
                ))
            }
        </Menu.Menu>
    )
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(DirectMessages)
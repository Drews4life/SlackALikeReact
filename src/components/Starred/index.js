import React, { useState } from 'react'
import { 
    Menu, 
    Icon,
} from 'semantic-ui-react'
import useStarredChannelsListener from '../../effects/useStarredChannelsListener'
import { setCurrentChannel, setPrivateChannel } from '../../store/actions'
import { connect } from 'react-redux'

const Starred = ({setCurrentChannel, setPrivateChannel, user}) => {

    const starredChannels = useStarredChannelsListener(user.uid)

    // const [starredChannels, updateStarredChannels] = useState([])
    const [activeChannel, setActiveChannel] = useState("")

    const changeChannel = channel => {
        setActiveChannel(channel)
        setCurrentChannel(channel)
        setPrivateChannel(false)
        // clearChannels()
    }

    const displayStarredChannels = () => 
        starredChannels.length > 0 && starredChannels.map(
            channel => (
                <Menu.Item
                    key={channel.id}
                    onClick={() => changeChannel(channel)}
                    name={channel.name}
                    style={{ opacity: .7 }}
                    active={activeChannel.id === channel.id}
                >   
                    # {channel.name}
                </Menu.Item>
            )
        )

    return (
        <Menu.Menu className="menu">
            <Menu.Item>
                <span>
                    <Icon name="exchange" /> STARRED &nbsp;
                    </span>
                ({starredChannels.length})
            </Menu.Item>
            {displayStarredChannels()}
        </Menu.Menu>
    )
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(Starred)
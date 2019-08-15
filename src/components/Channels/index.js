import React, { useState, useEffect } from 'react'
import { 
    Menu, 
    Icon,
    Modal,
    Form,
    Input,
    Button
} from 'semantic-ui-react'
import { createNewChannel } from '../../firebase'
import useAction from '../../effects/useAction'
import useChannels from '../../effects/useChannels'
import { connect } from 'react-redux'
import { setCurrentChannel, setPrivateChannel } from '../../store/actions';

const Channels = ({
    user,
    setCurrentChannel,
    setPrivateChannel
}) => {

    const [
        userChannels, 
        activeChannel, 
        setActiveChannel, 
        notifications,
        updateNotifications
    ] = useChannels(true)

    const [isFirstLaunch, setFirstLaunch] = useState(true)
    const [modalVisible, toggleVisibility] = useState(false)

    const [newChannel, updateNewChannel] = useState({name: "", details: ""})
    const [performCreateChannelStatus, performCreateChannel] = useAction(createNewChannel)

    useEffect(() => {
        if(userChannels.length > 0 && isFirstLaunch) {
            changeChannel(userChannels[0])
            setFirstLaunch(false)
        }
    }, [userChannels])

    useEffect(() => {
        if(performCreateChannelStatus.type === 'success') {
            cancel()
        } else if(performCreateChannelStatus.type === 'failure') {
            console.log('channel creation failed: ', performCreateChannelStatus)
        }

    }, [performCreateChannelStatus])

    const openModal = () => toggleVisibility(true)
    const onClose = () => toggleVisibility(false)

    const cancel = () => {
        updateNewChannel({name: "", details: ""})
        toggleVisibility(false)
    }
    
    const handleChange = e => {
        const { value, name } = e.target;
        updateNewChannel({...newChannel, [name]: value})
    }

    const isFormValid = () => newChannel.name && newChannel.details

    const handleSubmit = e => {
        e.preventDefault();
 
        if(isFormValid()) {
            performCreateChannel(newChannel, user)
        }
    }

    const clearChannels = () => {
        // let index = notifications.findIndex(notif => notif.id === activeChannel.id)

        // if(index !== -1) {
        //     let newNotifications = [...notifications]
        //     newNotifications[index].total = notifications[index].lastKnowTotal;
        //     newNotifications[index].count = 0

        //     updateNotifications(() => newNotifications)

        // }
    }

    const displayChannels = () => 
        userChannels.length > 0 && userChannels.map(
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
    

    const changeChannel = channel => {
        setActiveChannel(channel)
        setCurrentChannel(channel)
        setPrivateChannel(false)
        clearChannels()
    }

    const { 
        name,
        details
    } = newChannel

    return (
        <React.Fragment>
            <Menu.Menu className="menu">
                <Menu.Item>
                    <span>
                        <Icon name="exchange" /> CHANNELS &nbsp;
                    </span>
                    ({userChannels.length}) <Icon name="add" onClick={openModal}/>
                </Menu.Item>
                {displayChannels()}
            </Menu.Menu>

            <Modal basic open={modalVisible} onClose={onClose}>
                <Modal.Header>
                    Add a Channel
                </Modal.Header>

                <Modal.Content>
                    <Form onSubmit={handleSubmit}>
                        <Form.Field>
                            <Input 
                                fluid
                                label="Name of Channel"
                                name="name"
                                onChange={handleChange}
                                value={name}
                            />
                        </Form.Field>

                        <Form.Field>
                            <Input 
                                fluid
                                label="About the channel"
                                name="details"
                                onChange={handleChange}
                                value={details}
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <Button color='green' inverted onClick={handleSubmit}>
                        <Icon name='checkmark'/> Add
                    </Button>

                    <Button color='red' inverted onClick={cancel}>
                        <Icon name='remove'/> Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
        </React.Fragment>
    )
}


export default connect(null, { setCurrentChannel, setPrivateChannel })(Channels)
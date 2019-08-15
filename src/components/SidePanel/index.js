import React from 'react'
import { 
    Menu
} from 'semantic-ui-react'
import UserPanel from '../UserPanel';
import Channels from '../Channels';
import DirectMessages from '../DirectMessages'
import Starred from '../Starred'

const SidePanel = ({user, primaryColor}) => {
    return (
        <Menu
            size="large"
            inverted
            fixed="left"
            vertical
            style={{ background: primaryColor, fontSize: "1.2rem" }}
        >
            <UserPanel primaryColor={primaryColor} user={user}/>
            <Starred user={user}/>
            <Channels user={user}/>
            <DirectMessages user={user}/>
        </Menu>
    )
}


export default SidePanel
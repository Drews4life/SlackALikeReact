import React from 'react';
import { 
  Grid
} from 'semantic-ui-react'
import './App.css';

import ColorPanel from '../../components/ColorPanel'
import SidePanel from '../../components/SidePanel'
import Messages from '../../components/Messages'
import MetaPanel from '../../components/MetaPanel'

import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect';
import { 
  selectUser, 
  selectChannel, 
  selectIsPrivate, 
  selectUserPosts,
  selectPrimaryColor, 
  selectSecondaryColor
} from '../../store/selectors';

const App = ({
  user, 
  currentChannel,
  isPrivateChannel,
  userPosts,
  primaryColor,
  secondaryColor
}) => {
  return (
    <Grid columns="equal" className="app" style={{ background: secondaryColor }}>
  
      {user && (
        <React.Fragment>
          <ColorPanel user={user}/>
          <SidePanel user={user} primaryColor={primaryColor}/>
        </React.Fragment>
      )}

      <Grid.Column style={{marginLeft: "320px" }}>
        {(currentChannel && user) && (
          <Messages 
            user={user} 
            currentChannel={currentChannel}
            isPrivateChannel={isPrivateChannel}
          />
        )}
      </Grid.Column>

      <Grid.Column width={4}>
        {(currentChannel && userPosts) && (
          <MetaPanel 
            currentChannel={currentChannel} 
            isPrivateChannel={isPrivateChannel}
            userPosts={userPosts}
          />
        )}
      </Grid.Column>
    </Grid>
  );

}

const mapStateToProps = createStructuredSelector({
  user: selectUser,
  currentChannel: selectChannel,
  isPrivateChannel: selectIsPrivate,
  userPosts: selectUserPosts,
  primaryColor: selectPrimaryColor,
  secondaryColor: selectSecondaryColor
})

export default connect(mapStateToProps)(App)
import React from 'react'
import { Segment, Header, Input, Icon } from 'semantic-ui-react'

const MessagesHeader = ({
    channelName, 
    uniqueUsers,
    searchTerm,
    handleSearch,
    searching,
    isPrivateChannel,
    handleStar,
    isStarred
}) => {
    return (
        <Segment clearing>
            <Header
                // fluid
                as="h2"
                floated="left"
                style={{ marginBottom: 0 }}
            >
                <span>
                    {channelName}
                    {!isPrivateChannel && (
                        <Icon 
                            name={isStarred ? "star" : "star outline"}
                            color={isStarred ? "yellow" : "black"}
                            onClick={handleStar}
                        />
                    )}
                </span>
                <Header.Subheader>
                    {uniqueUsers}
                </Header.Subheader>
            </Header>

            <Header floated="right">
                <Input 
                    loading={searching}
                    onChange={handleSearch}
                    value={searchTerm}
                    size="mini"
                    icon="search"
                    name={"searchTerm"}
                    placeholder="Search Messages"
                />
            </Header>
        </Segment>
    )
}

export default MessagesHeader
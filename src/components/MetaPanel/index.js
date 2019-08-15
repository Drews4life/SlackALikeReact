import React, { useState } from 'react'
import { 
    Segment,
    Accordion,
    Header,
    Icon,
    Image,
    List
} from 'semantic-ui-react'

const MetaPanel = ({
    isPrivateChannel,
    currentChannel,
    userPosts
}) => {

    const [activeIndex, setActiveIndex] = useState(0)

    const handleSetIndex = (e, titleProps) => {
        const { index } = titleProps
        const newIndex = activeIndex === index ? -1 : index;
        setActiveIndex(newIndex)
    }

    const formatCount = num => (num > 1 || num === 0) ? `${num} posts` : `${num} post`

    const displayPosters = () => {
        return Object.entries(userPosts)
            .sort((a, b) => b[1] - a[1])
            .map(([key, val], i) =>  (   
                    <List.Item
                        key={i}
    
                    >
                        <Image src={val.avatar} avatar/>
                        <List.Content>
                            <List.Header as="a">
                                {key}
                            </List.Header>
                            <List.Description>
                                {formatCount(val.count)} posts
                            </List.Description>
                        </List.Content>
                    </List.Item>
                )
            ).slice(0, 5)
    }

    if(isPrivateChannel) return null
    
    return (
        <Segment>
            <Header as="h3" attached="top">
                About # {currentChannel.name}
            </Header>

            <Accordion styled attached="true">
                <Accordion.Title
                    active={activeIndex === 0}
                    index={0}
                    onClick={handleSetIndex}
                >
                    <Icon name="dropdown"/>
                    <Icon name="info" />
                    Channel Details
                </Accordion.Title>

                <Accordion.Content active={activeIndex === 0}>
                    {currentChannel.details}
                </Accordion.Content>

                <Accordion.Title
                    active={activeIndex === 1}
                    index={1}
                    onClick={handleSetIndex}
                >
                    <Icon name="dropdown"/>
                    <Icon name="user circle" />
                    Top Posters
                </Accordion.Title>

                <Accordion.Content active={activeIndex === 1}>
                    <List>
                        {userPosts && displayPosters()}
                    </List>
                </Accordion.Content>

                <Accordion.Title
                    active={activeIndex === 2}
                    index={2}
                    onClick={handleSetIndex}
                >
                    <Icon name="dropdown"/>
                    <Icon name="pencil alternate" />
                    Created By
                </Accordion.Title>

                <Accordion.Content active={activeIndex === 2}>
                    <Header as="h3">
                        <Image circular src={currentChannel.createdBy.avatar}/>
                        {currentChannel.createdBy.name}
                    </Header>
                </Accordion.Content>
            </Accordion>
        </Segment>
    )
}

export default MetaPanel
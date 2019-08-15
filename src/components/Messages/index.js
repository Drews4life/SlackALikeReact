import React, { useState, useEffect, useRef } from 'react'

import { Segment, Comment } from 'semantic-ui-react'
import MessagesHeader from '../MessagesHeader'
import MessageForm from '../MessageForm'
import Message from '../Message'
import Typing from '../Typing'
import Skeleton from '../Skeleton'

import useMessages from '../../effects/useMessages'
import useAction from '../../effects/useAction'
import useStarredListener from '../../effects/useStarsListener'
import useTypingListener from '../../effects/useTypingListener'

import { updateStarred } from '../../firebase'
import { connect } from 'react-redux'
import { setUserPosts } from '../../store/actions'

const Messages = ({
    currentChannel, 
    user,
    isPrivateChannel,
    setUserPosts
}) => {
    const [performStarredUpdateStatus, performStarredUpdate] = useAction(updateStarred)

    const [messages, uniqueUsers, isLoadingMessages] = useMessages(currentChannel.id, isPrivateChannel)
    const isStarred = useStarredListener(currentChannel.id, user.uid, performStarredUpdateStatus.type)
    const typingUsers = useTypingListener(currentChannel.id, user.uid)

    const [searchTerm, setSearchTerm] = useState("")
    const [isSearching, setIsSearching] = useState(false)
    // const [isChannelStarred, setChannelStarred] = useState(false)
    const [searchResults, setSearchResults] = useState([])

    const messagesEndRef = useRef()
    
    useEffect(() => {
        const newUniquePosts = messages.reduce((acc, msg) => {
            if(msg.user.name in acc) {
                acc[msg.user.name].count += 1;
            } else {
                acc[msg.user.name] = {
                    avatar: msg.user.avatar,
                    count: 1
                }
            }

            return acc
        }, [])
        
        setUserPosts(newUniquePosts)
        messagesEndRef.current.scrollIntoView({ behavior: "smooth"})
    }, [messages])

    const displayMessages = () => {
        const allMessages = searchTerm ? searchResults : messages

        return allMessages.length > 0 && allMessages.map(
            message => (
                <Message    
                    key={message.timestamp}
                    message={message}
                    user={user}
                />
            )
        )
    }

    const displaySkeleton = () => isLoadingMessages && [...Array(10)].map((_, i) => (
        <Skeleton key={i}/>
    ))

    const displayTypingUsers = () => 
        typingUsers.length > 0 && typingUsers.map(
            user => (
                <div style={{display: 'flex', alignItems: 'center', marginBottom: '.2em'}} key={user.id}>
                    <span className="user__typing">{user.name} is typing</span> <Typing />
                </div>
            )
        )

    const handleSearch = e => {
        setIsSearching(true)
        setSearchTerm(e.target.value)
        searchForMessage()
    }

    const searchForMessage = () => {
        const channelMessages = [...messages]
        const reg = new RegExp(searchTerm)
        
        const newSearchResults = channelMessages.reduce((acc, msg) => {
            if(msg.content && msg.content.match(reg)) {
                acc.push(msg)
            }
            
            return acc
        }, [])

        setSearchResults(newSearchResults)
        setTimeout(() => setIsSearching(false), 1000)
    }

    const handleStar = () => {
        performStarredUpdate(currentChannel, isStarred)
    }


    return (
        <React.Fragment>
            <MessagesHeader 
                channelName={`${isPrivateChannel ? "@" : "#"}${currentChannel.name}`}
                uniqueUsers={uniqueUsers}
                searchTerm={searchTerm}
                handleSearch={handleSearch}
                searching={isSearching}
                isPrivateChannel={isPrivateChannel}
                handleStar={handleStar}
                isStarred={isStarred}
            />

            <Segment //style={{height: '75vh'}}
            >
                <Comment.Group className="messages">
                    {displaySkeleton()}
                    {displayMessages()}
                    {displayTypingUsers()}
                    <div ref={messagesEndRef}></div>
                </Comment.Group>
            </Segment>

            <MessageForm 
                currentChannel={currentChannel} 
                user={user}
                isPrivateChannel={isPrivateChannel}
            />
        </React.Fragment>
    )
}

export default connect(null, { setUserPosts })(Messages)
import { useState, useEffect } from 'react'
import { messagesRef, privateMessagesRef } from '../firebase'

const useMessages = (channelId, isPrivate) => {
    const [messages, updateMessages] = useState([])
    const [isLoadingMessages, setLoadingMessages] = useState(true)
    const [uniqueUsers, setUniqueUsers] = useState('')

    useEffect(() => {
        updateMessages([])
        const ref = isPrivate ? privateMessagesRef : messagesRef
        
        ref.child(channelId).on("child_added", snap => {
            if(isLoadingMessages) {
                setLoadingMessages(false)
            }

            updateMessages(prevMessages => {
                if(prevMessages.some(msg => msg.timestamp === snap.val().timestamp)) {
                    return prevMessages
                }
                return [...prevMessages, snap.val()]
            })
        })

        return () => ref.off()
    }, [channelId])

    useEffect(() => {
        const newUniqueUsers = messages.reduce((acc, msg) => {
            if(!acc.includes(msg.user.name)) {
                acc.push(msg.user.name)
            }

            return acc
        }, [])
        const plural = newUniqueUsers.length > 1 || newUniqueUsers.length === 0
        const numUniqueUsers = `${newUniqueUsers.length} user${plural ? 's' : ''}`;
        setUniqueUsers(numUniqueUsers)
    }, [messages])

    return [messages, uniqueUsers, isLoadingMessages]
}

export default useMessages
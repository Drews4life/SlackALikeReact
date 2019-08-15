import { useEffect, useState } from 'react'
import { typingRef, connectedRef } from '../firebase'

const useTypingListener = (channelId, userId) => {
    const [typingUsers, setTypingUsers] = useState([])

    useEffect(() => {
        typingRef.child(channelId).on('child_added', snap => {
            if(snap.key !== userId) {
                setTypingUsers(users => {
                    return [...users, {id: snap.key, name: snap.val()}]
                })
            }
        })

        typingRef.child(channelId).on('child_removed', snap => {
            if(snap.key !== userId) {
                setTypingUsers(users => {
                    return users.filter(user => user.id !== snap.key)
                })
            }
        })

        connectedRef.on('value', snap => {
            if(snap.val()) {
                typingRef.child(channelId).child(userId).onDisconnect().remove(err => {
                    if(err !== null) {
                        console.log('Could not disconnect user with err: ', err)
                    }
                })
            }
        })

        return () => {
            connectedRef.off()
            typingRef.off()
        }
    }, [])

    return typingUsers
}


export default useTypingListener
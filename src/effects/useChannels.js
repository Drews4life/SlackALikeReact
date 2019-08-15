import { useEffect, useState } from 'react'
import { channelsRef, messagesRef } from '../firebase'

const useChannels = (withNotifications = false) => {
    const [userChannels, updateChannels] = useState([])
    const [notifications, updateNotifications] = useState([])
    const [activeChannel, setActiveChannel] = useState({})

    useEffect(() => {
        channelsRef.on('child_added', snap => {
            updateChannels((prevChannels) => {
                return [...prevChannels, snap.val()]
            })

            if(withNotifications) {
                const channelId = snap.key
                messagesRef.child(channelId).on('value', snap => {
                    setActiveChannel(activeChannel => {
                        if(activeChannel) {
                            updateNotifications(prevNotifications => {
                                let notifications = [...prevNotifications]
    
                                let lastTotal = 0
                                let index = notifications.findIndex(notif => notif.id === channelId)
            
                                if(index !== -1) {
                                    if(channelId !== activeChannel.id) {
                                        lastTotal = notifications[index].total
                                        if(snap.numChildren() - lastTotal > 0) {
                                            notifications[index].count = snap.numChildren() - lastTotal
                                        }
                                    }
            
                                    notifications[index].lastKnownTotal = snap.numChildren()
                                } else {
                                    let newNotification = {
                                        id: channelId,
                                        total: snap.numChildren(),
                                        lastKnownTotal: snap.numChildren(),
                                        count: 0
                                    }
    
                                    notifications.push(newNotification)
                                }                           
            
                                return notifications
                            })
    
                        }

                        return activeChannel
                    })
                
                })
            }
        })
        
        return () => {
            channelsRef.off()
            messagesRef.off()
        }
    }, [])

    return [
        userChannels, 
        activeChannel, 
        setActiveChannel,
        notifications,
        updateNotifications
    ]
}

export default useChannels
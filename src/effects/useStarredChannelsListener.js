import { useEffect, useState } from 'react'
import { userRef } from '../firebase';

const useStarredChannelsListener = userId => {
    const [starredChannels, setStarredChannels] = useState([])
    console.log('uid: ', userId)
    useEffect(() => {
        userRef.child(userId).child('starred').on('child_added', snap => {
            const starredChannel = {
                id: snap.key,
                ...snap.val()
            }

            setStarredChannels(allChannels => ([...allChannels, starredChannel]))
        })

        userRef.child(userId).child('starred').on('child_removed', snap => {
            setStarredChannels(allChannels => allChannels.filter(channel => channel.id !== snap.key))
        })

        return () => userRef.off()
    }, [])
    console.log('starred channels: ', starredChannels)
    return starredChannels
}

export default useStarredChannelsListener
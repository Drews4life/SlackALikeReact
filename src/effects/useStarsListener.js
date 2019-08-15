import { useEffect, useState } from 'react'
import { userRef } from '../firebase';

const useStarsListener = (channelId, userId, fetchStatus) => {
    const [isStarred, updateIsStarred] = useState(false)
    useEffect(() => {
        userRef
            .child(userId)
            .child('starred')
            .once('value', snap => {
                if(snap.val()) {
                    const channelIds = Object.keys(snap.val())
                    const prevStarred = channelIds.includes(channelId)
                    
                    updateIsStarred(prevStarred)
                } else {
                    updateIsStarred(false)
                }
            })
            
    }, [channelId, userId, fetchStatus])

    return isStarred
}

export default useStarsListener
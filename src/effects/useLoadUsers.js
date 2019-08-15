import { useEffect, useState } from 'react'
import { userRef, connectedRef, presenceRef } from '../firebase'

const useLoadUsers = user => {
    const [loadedUsers, setLoadedUsers] = useState([])

    const addStatusToUser = (userId, connected = true) => setLoadedUsers(loadedUsers => {
        const updatedUsers = loadedUsers.reduce((acc, rUser) => {
            if(rUser.uid === userId) {
                rUser['status'] = `${connected ? 'online' : 'offline'}`
            }

            return acc.concat(rUser)
        }, [])

        return updatedUsers
    })

    useEffect(() => {
        if(user) {
            userRef.on('child_added', snap => {
                if(snap.key !== user.uid) {
                    let singleUser = snap.val()
                    singleUser['uid'] = snap.key
                    singleUser['status'] = 'offline'
                    setLoadedUsers(prevLoadedUsers => {
                        return [...prevLoadedUsers, singleUser]
                    })
                }
            })

            connectedRef.on('value', snap => {
                if (snap.val()) {
                    const ref = presenceRef.child(user.uid)
                    ref.set(true)
                    ref.onDisconnect().remove(err => {
                        if (err !== null) {
                            console.log('Error occured in modifying presence: ', err.message)
                        }
                    })
                }
            })

            presenceRef.on('child_added', snap => {
                if(user.uid !== snap.key) {
                    addStatusToUser(snap.key)
                }
            })

            presenceRef.on('child_removed', snap => {
                if(user.uid !== snap.key) {
                    addStatusToUser(snap.key, false)
                }
            })
        }

        return () => {
            userRef.off()
            connectedRef.off()
            presenceRef.off()
        }
    }, [])

    return loadedUsers
}

export default useLoadUsers
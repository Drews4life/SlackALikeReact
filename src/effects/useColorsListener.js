import { useState, useEffect } from 'react'
import { userRef } from '../firebase'

const useColorsListener = userId => {
    const [userColors, setUserColors] = useState([])

    useEffect(() => {
        userRef.child(`${userId}/colors`).on('child_added', snap => {{
            setUserColors(colors => {
                return [snap.val(), ...colors]
            })
        }})

        return () => userRef.off()
    }, [])  

    return userColors
}

export default useColorsListener
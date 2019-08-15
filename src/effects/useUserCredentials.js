import { useState } from 'react'

const useUserCredentials = extended => {

    const registerState = {
        passwordConfirmation: "",
        username: ""
    }

    let credentials = {
        email: "",
        password: "",
        errors: [],
    }

    if(extended) {
        credentials = {...credentials, ...registerState}
    }

    const [userCredentials, setUserCredentials] = useState(credentials)
    const updateError = (e) => {
        const hasErr = userCredentials.errors.some(err => {
            if(err.message === e.message) {
                return true
            }
        })
        if(hasErr) return
        setUserCredentials({ ...userCredentials, errors: userCredentials.errors.concat(e)})
    }

    return [userCredentials, setUserCredentials, updateError]
}

export default useUserCredentials
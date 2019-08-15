import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'
import md5 from 'md5'
import uuidv4 from 'uuid/v4'
import { generateMessage } from '../utils';
import firebaseConfig from './config'

firebase.initializeApp(firebaseConfig);

export const userRef = firebase.database().ref("users")
export const connectedRef = firebase.database().ref(".info/connected")
export const typingRef = firebase.database().ref("typing")
export const presenceRef = firebase.database().ref("presence")
export const channelsRef = firebase.database().ref("channels")
export const messagesRef = firebase.database().ref("messages")
export const privateMessagesRef = firebase.database().ref("privateMessages")
export const storageRef = firebase.storage().ref("")


export const updateUser = (user, username) => user.updateProfile({
    displayName: username,
    photoURL: `http://gravatar.com/avatar/${md5(user.email)}?d=identicon`
})


export const saveUserToFIR = user => userRef.child(user.uid).set({
    name: user.displayName,
    avatar: user.photoURL
})

export const registerUser = async ({
    email,
    password,
    username
}) =>  {
    const { user } = await firebase.auth().createUserWithEmailAndPassword(email, password)
    await updateUser(user, username)
    await saveUserToFIR(user)

    return user
}

export const logInUser = async ({
    email,
    password,
}) => {
    return await firebase.auth().signInWithEmailAndPassword(email, password)
}

export const logoutUser = () => firebase.auth().signOut()


export const createNewChannel = ({
    name, 
    details
}, {
    displayName,
    photoURL
}) => {
    const key = channelsRef.push().key;
    const newChannel = {
        id: key,
        name,
        details,
        createdBy: {
            name: displayName,
            avatar: photoURL
        }
    }

    return channelsRef.child(key).update(newChannel)
}


export const sendMessage = (message, channelId, isPrivate) => {
    const ref = isPrivate ? privateMessagesRef : messagesRef;
    return ref.child(channelId).push().set(message)
}


export const uploadFile = async (file, metadata, channelId, isPrivate) => {
    const pathToUpload = channelId
    const currUser = firebase.auth().currentUser

    const fileDirectory = isPrivate ? `chat/private/${channelId}` : 'chat/public/' 
    const filePath = `${fileDirectory}${uuidv4()}`
    const ref = isPrivate ? privateMessagesRef : messagesRef;

    const task = await storageRef.child(filePath).put(file, metadata)
    const downloadURL = await task.ref.getDownloadURL()

    const message = generateMessage(currUser, null, downloadURL)

    const res = await ref.child(pathToUpload).push().set(message)

    return res
}

export const updateStarred = (channel, isStarred) => {
    const userId = firebase.auth().currentUser.uid
    return !isStarred ? addStarred(userId, channel) : removeStarred(userId, channel)
}

export const saveColors = (primary, secondary) => {
    const userId = firebase.auth().currentUser.uid
    return userRef.child(`${userId}/colors`).push().update({primary, secondary})
}

export const uploadUserPhoto = async blob => {
    const user = firebase.auth().currentUser
    const metadata = {
        contentType: 'image/jpeg'
    }
    console.log('uid: ', user.uid)
    const snap = await storageRef.child(`avatars/user/${user.uid}`).put(blob, metadata)
    const downloadURL = await snap.ref.getDownloadURL()

    return downloadURL
}

export const updateProfile = (img) => {
    const currUser = firebase.auth().currentUser.uid
    return Promise.all([
        currUser.updateProfile({photoURL: img}),
        userRef.child(currUser.uid).update({avatar: img})
    ])
}


export const setTypingStatus = (channelId, setStatus) => {
    const currUser = firebase.auth().currentUser
    const task = typingRef.child(channelId).child(currUser.uid)
    return setStatus ? task.set(currUser.displayName) : task.remove()
} 

const addStarred = (userId, channel) => {
    return userRef.child(`${userId}/starred`).update({ 
        [channel.id]: {
            name: channel.name,
            details: channel.details,
            createdBy: {
                ...channel.createdBy
            }
        }
    })
}

const removeStarred = (userId, channel) => {
    return userRef.child(`${userId}/starred`).child(channel.id).remove(err => {
        if(err !== null) {
            console.log("could not remove starred with err: ", err)
        }
    })
}

export default firebase
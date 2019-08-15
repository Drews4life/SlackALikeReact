import moment from 'moment'
import firebase from '../firebase'

export const timeFromNow = (timestamp) => moment(timestamp).fromNow()

export const generateMessage = (user, text = "", fileURL = null) => {
    const message = {
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        user: {
            id: user.uid,
            name: user.displayName,
            avatar: user.photoURL
        }
    }

    if(fileURL) {
        message['image']= fileURL
    } else {
        message['content'] = text
    }

    return message
}
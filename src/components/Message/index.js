import React, { useMemo } from 'react'
import { 
    Comment,
    Image
} from 'semantic-ui-react'
import { timeFromNow } from '../../utils';

const Message = ({ message, user }) => {

    const isOwnMessage = useMemo(() => {
        return message.user.id === user.uid ? "message__self" : ""
    }, [message]) 

    const isImage = useMemo(() => {
        return message.hasOwnProperty('image') && !message.hasOwnProperty('content')
    }, [message])

    return (
        <Comment>
            <Comment.Avatar src={message.user.avatar}/>
            <Comment.Content className={isOwnMessage}>
                <Comment.Author as="a">
                    {message.user.name}
                </Comment.Author>

                <Comment.Metadata>
                    {timeFromNow(message.timestamp)}
                </Comment.Metadata>

                {
                    isImage ? (
                        <Image src={message.image} className="message__image" />
                    ) : (
                        <Comment.Text>
                            {message.content}
                        </Comment.Text>
                    )
                }
            </Comment.Content>
        </Comment>
    )
}

export default Message
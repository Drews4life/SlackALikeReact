import React, { useState, useEffect, useRef } from 'react'
import { Segment, Button, Input } from 'semantic-ui-react'
import { sendMessage, uploadFile, setTypingStatus, messagesRef } from '../../firebase'
import useAction from '../../effects/useAction'

import FileModal from '../FileModal'
import { generateMessage } from '../../utils';

import { Picker, emojiIndex } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'

const MessageForm = ({
    currentChannel, 
    user,
    isPrivateChannel
}) => {

    const [messageText, updateMessage] = useState("")
    const [error, setError] = useState("")
    const [showModal, toggleVisibility] = useState(false)
    const [emojiPicker, toggleEmojiPicker] = useState(false)
    // const [uploadTask, setUploadTask] = useState(null)

    const [performSendMessageStatus, performSendMessage] = useAction(sendMessage)
    const [performFileUploadStatus, performFileUpload] = useAction(uploadFile)
    const [performSetTypingStatus, performSetTyping] = useAction(setTypingStatus)

    const messageInputRef = useRef()
    
    useEffect(() => {
        if(performSendMessageStatus.type === "failure") {
            setError(performSendMessageStatus.error.message)
        }
    }, [performSendMessageStatus])

    useEffect(() => {
        if(performFileUploadStatus.type === "failure") {
            console.log('failed to upload image with err: ',performFileUploadStatus)
            setError(performFileUploadStatus.error.message)
        }
    }, [performFileUploadStatus])

    const onInputChange = (e) => {
        updateMessage(e.target.value)
        setError("")
    }

    const submitMessage = () => {
        if(messageText) {
            const message = generateMessage(user, messageText)
            performSendMessage(message, currentChannel.id, isPrivateChannel)
            performSetTyping(currentChannel.id, false)
            updateMessage("")
            setError("")
        } else {
            setError("Add message")
        }
    }

    const submitFile = (file, metadata) => {
        performFileUpload(file, metadata, currentChannel.id, isPrivateChannel)
    }

    const handleKeyDown = e => {
        if(e.ctrlKey && e.keyCode === 13 && messageText) {
            submitMessage()
        }
        performSetTyping(currentChannel.id, !!messageText)
    }

    const handleAddEmoji = emoji => {
        updateMessage(msg => {
            return colonToUnicode(`${msg} ${emoji.colons}`)
        })
        toggleEmojiPicker(false)
        messageInputRef.current.focus()
    }

    const colonToUnicode = msg => {
        return msg.replace(/:[A-Za-z0-9_+-]+:/g, x => {
            x = x.replace(/:/g, "")
            let emoji = emojiIndex.emojis[x]
            if(typeof emoji !== 'undefined') {
                let unicode = emoji.native
                if(typeof unicode !== 'undefined') {
                    return unicode
                }
            }

            x = ":" + x + ":"
            return x
        })
    }

    const openModal = () => toggleVisibility(true)
    const closeModal = () => toggleVisibility(false)

    const handleOpenEmojiPicker = () => toggleEmojiPicker(picker => !picker)

    const isLoadingText = performSendMessageStatus.type === "pending"
    const isLoadingImage = performFileUploadStatus.type === "pending"

    return (
        <Segment className="message__form">
            {emojiPicker && (
                <Picker 
                    set="apple"
                    className="emojipicker"
                    title="Pick your emoji"
                    emoji="point_up"
                    onSelect={handleAddEmoji}
                />
            )}
            <Input 
                ref={messageInputRef}
                fluid
                name="message"
                onKeyDown={handleKeyDown}
                style={{ marginBottom: '0.7em' }}
                label={
                    <Button 
                        icon={emojiPicker ? "close" : "add"}
                        content={emojiPicker ? "Close" : null}
                        onClick={handleOpenEmojiPicker}
                    />
                }
                labelPosition="left"
                placeholder="Here goes your message"
                className={error.includes("message") ? "error" : ""}
                onChange={onInputChange}
                value={messageText}
            />

            <Button.Group icon widths="2">
                <Button
                    color="orange"
                    content="Send"
                    labelPosition="left"
                    icon="edit"
                    onClick={submitMessage}
                    disabled={isLoadingText}
                    loading={isLoadingText}
                />

                <Button 
                    color="teal"
                    content="Upload Media"
                    labelPosition="right"
                    icon="cloud upload"
                    onClick={openModal}
                    disabled={isLoadingImage}
                    loading={isLoadingImage}
                />

                <FileModal 
                    visible={showModal}
                    closeModal={closeModal}
                    uploadFile={submitFile}
                />
            </Button.Group>
        </Segment>
    )
}

export default MessageForm
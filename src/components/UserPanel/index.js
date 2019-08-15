import React, { useState, useRef, useEffect } from 'react'
import { 
    Grid,
    Header,
    Icon,
    Dropdown,
    Image,
    Modal,
    Input,
    Button
} from 'semantic-ui-react'
import AvatarEditor from 'react-avatar-editor'
import useAction from '../../effects/useAction'
import { uploadUserPhoto, updateProfile } from '../../firebase'
import { logoutUser } from '../../firebase'

const UserPanel = ({
    user,
    primaryColor
}) => {

    const [perfomUploadAvatarStatus, performUploadAvatar] = useAction(uploadUserPhoto)
    const [perfomUpdateProfileStatus, performUpdateProfile] = useAction(updateProfile)

    const [modalVisible, setModalVisibility] = useState(false)
    const [previewImage, setPreviewImage] = useState('')
    const [croppedImage, setCroppedImage] = useState('')
    const [uploadedCroppedImage, setUploadedCroppedImage] = useState('')
    const [blob, setBlob] = useState('')

    const avatarEditorRef = useRef()

    useEffect(() => {
        if(perfomUploadAvatarStatus.type === 'success') {
            setUploadedCroppedImage(perfomUploadAvatarStatus.result)
            performUpdateProfile(perfomUploadAvatarStatus.result)
            closeModal()
        } else if (perfomUploadAvatarStatus.type === 'failure') {
            console.log("failed to upload avatar: ", perfomUploadAvatarStatus.error)
        }
    }, [perfomUploadAvatarStatus])

    const openModal = () => setModalVisibility(true)
    const closeModal = () => {
        setCroppedImage("")
        setPreviewImage("")
        setUploadedCroppedImage("")
        setBlob("")
        setModalVisibility(false)
    }

    const dropdownOptions = () => [
        {
            key: "user",
            text: <span>Signed in as <strong>{user.displayName}</strong></span>,
            disabled: true
        },
        {
            key: "avatar",
            text: <div onClick={openModal}>Change Avatar</div>
        },
        {
            key: "signout",
            text: <div onClick={handleSignOut}>Signed Out</div>
        }
    ]

    const handleChange = e => {
        const file = e.target.files[0];
        const reader = new FileReader()

        if(file) {
            reader.readAsDataURL(file)
            reader.addEventListener('load', () => {
                setPreviewImage(reader.result)
            })
        }
    }

    const handleCropImg = () => {
        if(avatarEditorRef) {
            avatarEditorRef.current.getImageScaledToCanvas().toBlob(blob => {
                let imageURL = URL.createObjectURL(blob)
                
                setCroppedImage(imageURL)
                setBlob(blob)
            })
        }
    }

    const handleSignOut = async () => {
        try { 
            await logoutUser() 
        }
        catch(e) { 
            console.log("logout failed: ", e)
        }
    }

    const uploadNewAvatar = () => {
        performUploadAvatar(blob)
    }

    return (
        <Grid style={{ background: primaryColor }}>
            <Grid.Column>
                <Grid.Row style={{ padding: '1.2rem', margin: 0 }}>
                    <Header inverted floated="left" as="h2">
                        <Icon name="code"/>
                        <Header.Content>
                            Drews Slack
                        </Header.Content>
                    </Header>

                    <Header style={{ padding: "0.25rem" }} as="h4" inverted>
                        <Dropdown 
                            trigger={
                            <span>
                                <Image src={user.photoURL} spaced="right" avatar/>
                                {user.displayName}
                            </span>
                            }
                            options={dropdownOptions()}
                        />
                    </Header>
                </Grid.Row>

                <Modal basic open={modalVisible} onClose={closeModal}>
                    <Modal.Header>Change Avatar</Modal.Header>
                    <Modal.Content>
                        <Input 
                            fluid
                            type="file"
                            label="New Avatar"
                            name="previewImage"
                            onChange={handleChange}
                        />
                        <Grid centered stackable columns={2}>
                            <Grid.Row centered>
                                <Grid.Column className="ui center aligned grid">
                                    {previewImage && (
                                        <AvatarEditor 
                                            ref={avatarEditorRef}
                                            image={previewImage}
                                            width={120}
                                            height={120}
                                            border={50}
                                            scale={1.2}
                                        />
                                    )}
                                </Grid.Column>

                                <Grid.Column>
                                    {croppedImage && (
                                        <Image 
                                            style={{ margin: '3.5rem auto'}}
                                            width={100}
                                            height={100}
                                            src={croppedImage}
                                        />
                                    )}
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Modal.Content>
                    <Modal.Actions>
                        {croppedImage && (
                            <Button color="green" inverted onClick={uploadNewAvatar}>
                                <Icon name="save"/> Change Avatar
                            </Button>
                        )}
            
                        <Button color="green" inverted onClick={handleCropImg}>
                            <Icon name="image"/> Preview
                        </Button>

                        <Button color="red" inverted onClick={closeModal}>
                            <Icon name="remove"/> Cancel
                        </Button>
                    </Modal.Actions>
                </Modal>
            </Grid.Column>
        </Grid>
    )
}

export default UserPanel
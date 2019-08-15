import React, { useState } from 'react'
import { 
    Modal,
    Icon,
    Button,
    Input,
} from 'semantic-ui-react'
import mime from 'mime-types'


const FileModal = ({
    visible,
    closeModal,
    uploadFile
}) => {

    const [file, setFile] = useState(null)
    const [allowedTypes, _] = useState(['image/jpeg', 'image/png'])

    const isFileValid = () => allowedTypes.includes(mime.lookup(file.name))

    const addFile = e => {
        const file = e.target.files[0]

        if(file) {
            setFile(file)
        }
    }

    const sendFile = () => {
        if(file !== null) {
            if(isFileValid()) {
                const metadata = { content: mime.lookup(file.name) }
                uploadFile(file, metadata)
                closeModal()
                setFile(null)
            }
        }
    }


    return (
        <Modal basic open={visible} onClose={closeModal}>
            <Modal.Header>
                Select an image file
            </Modal.Header>

            <Modal.Content>
                <Input
                    fluid 
                    label="Supported file types: jpg, png;"
                    name="file"
                    type="file"
                    onChange={addFile}
                />
            </Modal.Content>

            <Modal.Actions>
                <Button 
                    color="green"
                    inverted
                    onClick={sendFile}
                >
                    <Icon name="checkmark"/> Send
                </Button>

                <Button 
                    color="red"
                    inverted
                    onClick={closeModal}
                >
                    <Icon name="remove"/> Cancel
                </Button>
            </Modal.Actions>
        </Modal>
    )
}

export default FileModal
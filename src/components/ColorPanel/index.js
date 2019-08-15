import React, { useState, useEffect } from 'react'
import { 
    Menu,
    Sidebar,
    Divider,
    Button,
    Modal,
    Icon,
    Label,
    Segment
} from 'semantic-ui-react'
import { saveColors } from '../../firebase'
import useAction from '../../effects/useAction'
import useColorsListener from '../../effects/useColorsListener'
import { SliderPicker } from 'react-color'
import { connect } from 'react-redux'
import { setColors } from '../../store/actions'

const ColorPanel = ({
    user,
    setColors
}) => {

    const [performSaveColorsStatus, performSaveColors] = useAction(saveColors)

    const userColors = useColorsListener(user.uid)

    const [modalVisible, setModalVisibilty] = useState(false)
    const [primary, setPrimary] = useState('')
    const [secondary, setSecondary] = useState('')

    useEffect(() => {
        
    }, [performSaveColorsStatus])

    const openModal = () => setModalVisibilty(true)
    const closeModal = () => setModalVisibilty(false)

    const handleChangePrimary = color => setPrimary(color.hex)
    const handleChangeSecondary = color => setSecondary(color.hex)
    
    const handleSaveColors = () => {
        if(primary && secondary && primary !== "#000000" && secondary !== "#000000") {
            performSaveColors(primary, secondary)
            closeModal()
        }
    }
    
    const displayUserColors = () => 
        userColors.length > 0 && userColors.map((colors, i) => (
            <React.Fragment key={i}>
                <Divider/>
                <div 
                    className="color__container"
                    onClick={() => setColors(colors.primary, colors.secondary)}
                >
                    <div className="color__square" style={{ background: colors.primary }}>
                        <div className="color__overlay" style={{ background: colors.secondary }}></div>
                    </div>
                </div>
            </React.Fragment>   
        ))

    return (
        <Sidebar
            as={Menu}
            icon="labeled"
            inverted
            vertical
            visible
            width="very thin"
        >
            <Divider/>
            <Button 
                icon="add" 
                size="small" 
                color="blue"
                onClick={openModal}
            />

            {displayUserColors()}

            <Modal 
                basic 
                open={modalVisible}
                onClose={closeModal}
            >
                <Modal.Header>
                    Choose App Colors
                </Modal.Header>

                <Modal.Content>
                    <Segment inverted>
                        <Label content="Primary Color"/>
                        <SliderPicker color={primary} onChange={handleChangePrimary}/>
                    </Segment>
                    
                    <Segment inverted>
                        <Label content="Secondary Color"/>
                        <SliderPicker color={secondary} onChange={handleChangeSecondary}/>
                    </Segment>
                </Modal.Content>
            
                <Modal.Actions>
                    <Button color="green" inverted onClick={handleSaveColors}>
                        <Icon name="checkmark" /> Save Colors
                    </Button>

                    <Button color="red" inverted onClick={closeModal}>
                        <Icon name="remove" /> Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
        </Sidebar>
    )
}


export default connect(null, {setColors})(ColorPanel)
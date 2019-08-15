import React from 'react'
import { Loader, Dimmer } from "semantic-ui-react";

const Spinner = () => (
    <Dimmer active>
        <Loader size="huge" content="Getting ready for the action..."/>
    </Dimmer>
)

export default Spinner
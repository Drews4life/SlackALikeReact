import React, { useEffect } from 'react'
import { 
    Grid, 
    Form, 
    Segment,
    Button, 
    Header, 
    Message, 
    Icon 
} from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { logInUser } from '../../firebase';
import useUserCredentials from '../../effects/useUserCredentials'
import useAction from '../../effects/useAction';

const Login = () => {

    const [userCredentials, setUserCredentials, updateError] = useUserCredentials(false)
    const [performLogInStatus, performLogIn] = useAction(logInUser)

    useEffect(() => {
        if(performLogInStatus.type === 'success') {
            console.log("user logged in: ", performLogInStatus)
        } else if(performLogInStatus.type === 'failure') {
            updateError(performLogInStatus.error)
        }
    }, [performLogInStatus])

    const handleSubmit = e => {
        e.preventDefault()

        if(isFormValid()) {
            performLogIn(userCredentials)
        }
    }

    const handleChange = e => {
        const { value, name } = e.target
        setUserCredentials({ ...userCredentials, [name]: value })
    }

    const isFormValid = () => {
        const { email, password } = userCredentials
        let err;
        
        if(!email.length && !password.length) {
            err = { message: "Inputs cannot be empty"}
            updateError(err)
            return false
        } else if(password.length < 6) {
            err = { message: "Password must be longer than 6 chars"}
            updateError(err)
            return false
        } else {
            return true
        }
    }

    const handleInputErr = inputName => {
        const { errors } = userCredentials
        return errors.some(err => err.message.toLowerCase().includes(inputName)) ? "error" : ""
    }

    const displayErrors = () => errors.map((err, i) => <p key={i}>{err.message}</p>)

    const {
        email,
        password,
        errors
    } = userCredentials

    const isLoading = performLogInStatus.type === 'pending';

    return (
        <Grid textAlign='center' verticalAlign='middle' className="app">
            <Grid.Column style={{ maxWidth: "450px" }}>
                <Header as="h1" icon color='violet' textAlign='center'>
                    <Icon name='code branch' color='violet' />
                    Login to Drews-Slack-A-Like chat
                </Header>

                <Form size='large' onSubmit={handleSubmit}>
                    <Segment stacked>
                        <Form.Input
                            fluid 
                            name="email" 
                            icon="mail" 
                            iconPosition='left' 
                            placeholder="Email"
                            type="email"
                            className={handleInputErr('email')}
                            onChange={handleChange}
                            value={email}
                        />
                        <Form.Input
                            fluid 
                            name="password" 
                            icon="lock" 
                            iconPosition='left' 
                            placeholder="Password"
                            className={handleInputErr('password')}
                            type="password"
                            onChange={handleChange}
                            value={password}
                        />
                        <Button 
                            disabled={isLoading}
                            className={isLoading ? 'loading' : ""}
                            color='violet' 
                            size='large' 
                            fluid
                        > 
                            Submit 
                        </Button>
                    </Segment>
                </Form>

                {
                    errors.length > 0 && (
                        <Message error>
                            <h3>Error</h3>
                            {displayErrors()}
                        </Message>
                    )
                }

                <Message>
                    Don't have an account? <Link to="/register">Register</Link> 
                </Message>
            </Grid.Column>
        </Grid>
    )
}

export default Login
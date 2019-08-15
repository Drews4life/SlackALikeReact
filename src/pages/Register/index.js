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
import { registerUser } from '../../firebase'
import useAction from '../../effects/useAction'
import useUserCredentails from '../../effects/useUserCredentials'

const Register = () => {

    const [performRegisterStatus, performRegistration] = useAction(registerUser)
    const [userCredentials, setUserCredentials, updateError] = useUserCredentails(true)

    useEffect(() => {
        if(performRegisterStatus.type === 'failure') {
            updateError(performRegisterStatus.error)
        }
    }, [performRegisterStatus])

    const handleChange = e => {
        const { value, name } = e.target;
        setUserCredentials({ ...userCredentials, errors: [], [name]: value });
    }

    const isFormEmpty = () => {
        const { 
            email,
            username,
            password, 
            passwordConfirmation 
        } = userCredentials
        
        return !email.length || 
               !username.length || 
               !password.length || 
               !passwordConfirmation.length 
    }

    const isPasswordValid = () => {
        const { password, passwordConfirmation } = userCredentials

        if(password !== passwordConfirmation) {
            return false
        } else if(password.length < 6) {
            return false
        } else {
            return true
        }
    }

    const isFormValid = () => {
        let err;
        
        if(isFormEmpty()) {
            err = { message: "Fill all fields" }
            updateError(err)
            return false
        } else if(!isPasswordValid()) {
            err = { message: "Password is invalid" }
            updateError(err)
            return false
        } else {
            return true
        }
    }

    const handleSubmit = e => {
        e.preventDefault();
        
        if(isFormValid()) {
            setUserCredentials({...userCredentials, errors: []})
            performRegistration(userCredentials)
        }
    }

    const handleInputErr = inputName => {
        const { errors } = userCredentials
        return errors.some(err => err.message.toLowerCase().includes(inputName)) ? "error" : ""
    }

    const displayErrors = () => errors.map((err, i) => <p key={i}>{err.message}</p>)
    
    const {
        username,
        email,
        errors,
        password,
        passwordConfirmation
    } = userCredentials 

    const isLoading = performRegisterStatus.type === 'pending'
    
    return (
        <Grid textAlign='center' verticalAlign='middle' className="app">
            <Grid.Column style={{ maxWidth: "450px" }}>
                <Header as="h1" icon color='orange' textAlign='center'>
                    <Icon name='puzzle piece' color='orange' />
                    Register for Drews-Slack-A-Like chat
                </Header>

                <Form size='large' onSubmit={handleSubmit}>
                    <Segment stacked>
                        <Form.Input
                            fluid 
                            name="username" 
                            icon="user" 
                            iconPosition='left' 
                            placeholder="Username"
                            type="text"
                            onChange={handleChange}
                            value={username}
                        />
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
                        <Form.Input
                            fluid 
                            name="passwordConfirmation" 
                            icon="repeat" 
                            iconPosition='left' 
                            placeholder="Confirm Password"
                            className={handleInputErr('password')}
                            type="password"
                            onChange={handleChange}
                            value={passwordConfirmation}
                        />

                        <Button 
                            disabled={isLoading}
                            className={isLoading ? 'loading' : ""}
                            color='orange' 
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
                    Already a user? <Link to="/login">Login</Link> 
                </Message>
            </Grid.Column>
        </Grid>
    )
}

export default Register
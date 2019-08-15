import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

import { 
    BrowserRouter as Router, 
    Switch, 
    Route,
    withRouter 
} from 'react-router-dom'

import { Provider } from 'react-redux'
import { initStore } from './store'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { selectUser, selectIsLoadingUser } from './store/selectors';
import { setUser, clearUser } from './store/actions';

import ErrorBoundary from './components/ErrorBoundary'
import Spinner from './components/Spinner'

import firebase from './firebase'

import 'semantic-ui-css/semantic.min.css'

const AppRoute = React.lazy(() => import("./pages/App/"))
const LoginRoute = React.lazy(() => import("./pages/Login/"))
const RegisterRoute = React.lazy(() => import("./pages/Register/"))

const Root = ({
    history,
    setUser,
    clearUser,
    isLoading
}) => {

    useEffect(() => {  
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            if(user) {
                history.push("/")
                setUser(user)
            } else {
                history.push("/login")
                clearUser()
            }
        })

        return () => unsubscribe()
    }, [])
    
    if(isLoading) {
        return <Spinner/>
    }

    return (
        <Switch>
            <ErrorBoundary>
                <React.Suspense fallback={<Spinner />}>
                    <Route exact path="/" component={AppRoute} />
                    <Route exact path="/login" component={LoginRoute} />
                    <Route exact path="/register" component={RegisterRoute} />
                </React.Suspense>
            </ErrorBoundary>
        </Switch>
    )
}

const mapStateToProps = createStructuredSelector({
    isLoading: selectIsLoadingUser
})

const RootWithAuth = connect(mapStateToProps, { setUser, clearUser })(withRouter(Root))

ReactDOM.render(
    <Provider store={initStore()}>
        <Router>
            <RootWithAuth />
        </Router>
    </Provider>
, 
    document.getElementById('root')
);

registerServiceWorker();

import React, { Component } from 'react'

export default class ErrorBoundary extends Component {

    state = { hasError: false }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    componentDidCatch(err) {
        console.log("Component failed with error: ", err)
    }

    render() {
        if(this.state.hasError) {
            return <div>Error Occured</div>
        }

        return this.props.children
    }
}
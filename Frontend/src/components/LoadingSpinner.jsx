import React from 'react'
import './components.css'

function LoadingSpinner({ fullScreen = false, message = 'Loading...' }) {
    if (fullScreen) {
        return (
            <div className="loading-fullscreen">
                <div className="spinner"></div>
                <p className="loading-message">{message}</p>
            </div>
        )
    }

    return (
        <div className="loading-inline">
            <div className="spinner spinner-small"></div>
            <span className="loading-message">{message}</span>
        </div>
    )
}

export default LoadingSpinner

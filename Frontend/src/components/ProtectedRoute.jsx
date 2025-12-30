import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../config'
import LoadingSpinner from './LoadingSpinner'

function ProtectedRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            await axios.get(`${API_BASE_URL}/api/user/profile`, {
                withCredentials: true
            })
            setIsAuthenticated(true)
        } catch (error) {
            console.log('Auth check failed:', error)
            setIsAuthenticated(false)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <LoadingSpinner fullScreen message="Checking authentication..." />
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return children
}

export default ProtectedRoute

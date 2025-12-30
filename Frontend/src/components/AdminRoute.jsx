import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../config'
import LoadingSpinner from './LoadingSpinner'

function AdminRoute({ children }) {
    const [authState, setAuthState] = useState({
        isAuthenticated: null,
        isAdmin: null
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/user/profile`, {
                withCredentials: true
            })
            setAuthState({
                isAuthenticated: true,
                isAdmin: response.data.user.role === 'admin'
            })
        } catch (error) {
            console.log('Auth check failed:', error)
            setAuthState({ isAuthenticated: false, isAdmin: false })
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <LoadingSpinner fullScreen message="Checking permissions..." />
    }

    if (!authState.isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (!authState.isAdmin) {
        return <Navigate to="/dashboard" replace />
    }

    return children
}

export default AdminRoute

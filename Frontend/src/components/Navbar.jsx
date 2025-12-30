import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../config'
import './Navbar.css'

function Navbar() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Fetch user profile on mount
    useEffect(() => {
        fetchUserProfile()
    }, [])

    const fetchUserProfile = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/user/profile`, {
                withCredentials: true
            })
            setUser(response.data.user)
        } catch (error) {
            console.log('Error fetching profile:', error)
            // Redirect to login if not authenticated
            navigate('/login')
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        try {
            await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, {
                withCredentials: true
            })
            navigate('/login')
        } catch (error) {
            console.log('Logout error:', error)
            // Still redirect to login even if logout fails
            navigate('/login')
        }
    }

    if (loading) {
        return (
            <nav className="navbar">
                <div className="navbar-container">
                    <span className="navbar-brand">User Management</span>
                    <span>Loading...</span>
                </div>
            </nav>
        )
    }

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Brand */}
                <Link to="/dashboard" className="navbar-brand">
                    User Management
                </Link>

                {/* Navigation Links */}
                <div className="navbar-links">
                    {/* Admin-only link */}
                    {user?.role === 'admin' && (
                        <Link to="/admin" className="nav-link">
                            Dashboard
                        </Link>
                    )}

                    <Link to="/profile" className="nav-link">
                        Profile
                    </Link>
                </div>

                {/* User Info & Logout */}
                <div className="navbar-user">
                    <div className="user-info">
                        <span className="user-name">{user?.Fullname}</span>
                        <span className={`user-role ${user?.role}`}>{user?.role}</span>
                    </div>
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
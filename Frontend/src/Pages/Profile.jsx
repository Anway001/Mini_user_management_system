import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../config'
import Navbar from '../components/Navbar'
import './Profile.css'

function Profile() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Edit profile state
    const [isEditing, setIsEditing] = useState(false)
    const [editForm, setEditForm] = useState({
        Fullname: '',
        email: '',
        password: ''
    })

    // Change password state
    const [showPasswordSection, setShowPasswordSection] = useState(false)
    const [passwordForm, setPasswordForm] = useState({
        oldpassword: '',
        newpassword: '',
        confirmPassword: ''
    })

    // Messages
    const [message, setMessage] = useState({ text: '', type: '' })
    const [passwordMessage, setPasswordMessage] = useState({ text: '', type: '' })

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/user/profile`, {
                withCredentials: true
            })
            setUser(response.data.user)
            setEditForm({
                Fullname: response.data.user.Fullname,
                email: response.data.user.email,
                password: ''
            })
        } catch (error) {
            console.log('Error fetching profile:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleEditChange = (e) => {
        const { name, value } = e.target
        setEditForm(prev => ({ ...prev, [name]: value }))
    }

    const handlePasswordChange = (e) => {
        const { name, value } = e.target
        setPasswordForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSaveProfile = async (e) => {
        e.preventDefault()
        setMessage({ text: '', type: '' })

        if (!editForm.password) {
            setMessage({ text: 'Password is required to save changes', type: 'error' })
            return
        }

        try {
            await axios.patch(
                `${API_BASE_URL}/api/user/profile`,
                editForm,
                { withCredentials: true }
            )
            setMessage({ text: 'Profile updated successfully', type: 'success' })
            setIsEditing(false)
            setEditForm(prev => ({ ...prev, password: '' }))
            fetchProfile()
        } catch (error) {
            setMessage({
                text: error.response?.data?.message || 'Failed to update profile',
                type: 'error'
            })
        }
    }

    const handleCancelEdit = () => {
        setIsEditing(false)
        setEditForm({
            Fullname: user.Fullname,
            email: user.email,
            password: ''
        })
        setMessage({ text: '', type: '' })
    }

    const handleChangePassword = async (e) => {
        e.preventDefault()
        setPasswordMessage({ text: '', type: '' })

        if (!passwordForm.oldpassword || !passwordForm.newpassword) {
            setPasswordMessage({ text: 'All fields are required', type: 'error' })
            return
        }

        if (passwordForm.newpassword !== passwordForm.confirmPassword) {
            setPasswordMessage({ text: 'New passwords do not match', type: 'error' })
            return
        }

        if (passwordForm.newpassword.length < 8) {
            setPasswordMessage({ text: 'Password must be at least 8 characters', type: 'error' })
            return
        }

        try {
            await axios.patch(
                `${API_BASE_URL}/api/user/changepassword`,
                {
                    oldpassword: passwordForm.oldpassword,
                    newpassword: passwordForm.newpassword
                },
                { withCredentials: true }
            )
            setPasswordMessage({ text: 'Password changed successfully', type: 'success' })
            setPasswordForm({ oldpassword: '', newpassword: '', confirmPassword: '' })
            setShowPasswordSection(false)
        } catch (error) {
            setPasswordMessage({
                text: error.response?.data?.message || 'Failed to change password',
                type: 'error'
            })
        }
    }

    if (loading) {
        return (
            <div className="profile-page">
                <Navbar />
                <div className="profile-container">
                    <div className="loading">Loading profile...</div>
                </div>
            </div>
        )
    }

    return (
        <div className="profile-page">
            <Navbar />

            <div className="profile-container">
                <div className="profile-header">
                    <h1>My Profile</h1>
                </div>

                {/* Profile Card */}
                <div className="profile-card">
                    <div className="card-header">
                        <h2>Profile Information</h2>
                        {!isEditing && (
                            <button
                                className="edit-btn"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit
                            </button>
                        )}
                    </div>

                    {message.text && (
                        <div className={`message ${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    {isEditing ? (
                        <form onSubmit={handleSaveProfile} className="edit-form">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="Fullname"
                                    value={editForm.Fullname}
                                    onChange={handleEditChange}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editForm.email}
                                    onChange={handleEditChange}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Current Password (required to save)</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={editForm.password}
                                    onChange={handleEditChange}
                                    className="form-input"
                                    placeholder="Enter your current password"
                                />
                            </div>
                            <div className="form-actions">
                                <button type="button" className="cancel-btn" onClick={handleCancelEdit}>
                                    Cancel
                                </button>
                                <button type="submit" className="save-btn">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="profile-info">
                            <div className="info-row">
                                <span className="info-label">Full Name</span>
                                <span className="info-value">{user?.Fullname}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Email</span>
                                <span className="info-value">{user?.email}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Role</span>
                                <span className={`role-badge ${user?.role}`}>{user?.role}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Status</span>
                                <span className={`status-badge ${user?.isActive ? 'active' : 'inactive'}`}>
                                    {user?.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Change Password Section */}
                <div className="profile-card">
                    <div className="card-header">
                        <h2>Change Password</h2>
                        {!showPasswordSection && (
                            <button
                                className="edit-btn"
                                onClick={() => setShowPasswordSection(true)}
                            >
                                Change
                            </button>
                        )}
                    </div>

                    {passwordMessage.text && (
                        <div className={`message ${passwordMessage.type}`}>
                            {passwordMessage.text}
                        </div>
                    )}

                    {showPasswordSection && (
                        <form onSubmit={handleChangePassword} className="edit-form">
                            <div className="form-group">
                                <label>Current Password</label>
                                <input
                                    type="password"
                                    name="oldpassword"
                                    value={passwordForm.oldpassword}
                                    onChange={handlePasswordChange}
                                    className="form-input"
                                    placeholder="Enter current password"
                                />
                            </div>
                            <div className="form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    name="newpassword"
                                    value={passwordForm.newpassword}
                                    onChange={handlePasswordChange}
                                    className="form-input"
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordForm.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="form-input"
                                    placeholder="Confirm new password"
                                />
                            </div>
                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => {
                                        setShowPasswordSection(false)
                                        setPasswordForm({ oldpassword: '', newpassword: '', confirmPassword: '' })
                                        setPasswordMessage({ text: '', type: '' })
                                    }}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="save-btn">
                                    Change Password
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Profile

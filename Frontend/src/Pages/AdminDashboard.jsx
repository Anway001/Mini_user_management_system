import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../config'
import Navbar from '../components/Navbar'
import './AdminDashboard.css'

function AdminDashboard() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalUsers, setTotalUsers] = useState(0)

    // Notification state
    const [notification, setNotification] = useState({ show: false, message: '', type: '' })

    // Confirmation dialog state
    const [confirmDialog, setConfirmDialog] = useState({
        show: false,
        userId: null,
        action: '',
        userName: ''
    })

    const limit = 10

    useEffect(() => {
        fetchUsers(currentPage)
    }, [currentPage])

    const fetchUsers = async (page) => {
        setLoading(true)
        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/admin/getAllusers?page=${page}&limit=${limit}`,
                { withCredentials: true }
            )
            setUsers(response.data.users)
            setTotalPages(response.data.totalPages)
            setTotalUsers(response.data.totalUsers)
        } catch (error) {
            console.log('Error fetching users:', error)
            showNotification('Failed to fetch users', 'error')
        } finally {
            setLoading(false)
        }
    }

    const showNotification = (message, type) => {
        setNotification({ show: true, message, type })
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' })
        }, 3000)
    }

    const openConfirmDialog = (userId, action, userName) => {
        setConfirmDialog({ show: true, userId, action, userName })
    }

    const closeConfirmDialog = () => {
        setConfirmDialog({ show: false, userId: null, action: '', userName: '' })
    }

    const handleConfirmAction = async () => {
        const { userId, action } = confirmDialog
        try {
            if (action === 'activate') {
                await axios.patch(
                    `${API_BASE_URL}/api/admin/users/${userId}/activate`,
                    {},
                    { withCredentials: true }
                )
                showNotification('User activated successfully', 'success')
            } else {
                await axios.patch(
                    `${API_BASE_URL}/api/admin/users/${userId}/deactivate`,
                    {},
                    { withCredentials: true }
                )
                showNotification('User deactivated successfully', 'success')
            }
            fetchUsers(currentPage)
        } catch (error) {
            console.log('Error updating user:', error)
            showNotification(error.response?.data?.message || 'Action failed', 'error')
        } finally {
            closeConfirmDialog()
        }
    }

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    return (
        <div className="admin-dashboard">
            <Navbar />

            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1>Admin Dashboard</h1>
                    <p>Total Users: {totalUsers}</p>
                </div>

                {/* Notification */}
                {notification.show && (
                    <div className={`notification ${notification.type}`}>
                        {notification.message}
                    </div>
                )}

                {/* Users Table */}
                <div className="table-container">
                    {loading ? (
                        <div className="loading">Loading users...</div>
                    ) : (
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Full Name</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id}>
                                        <td>{user.email}</td>
                                        <td>{user.Fullname}</td>
                                        <td>
                                            <span className={`role-badge ${user.role}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                                                {user.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="actions-cell">
                                            {user.isActive ? (
                                                <button
                                                    className="action-btn deactivate"
                                                    onClick={() => openConfirmDialog(user._id, 'deactivate', user.Fullname)}
                                                >
                                                    Deactivate
                                                </button>
                                            ) : (
                                                <button
                                                    className="action-btn activate"
                                                    onClick={() => openConfirmDialog(user._id, 'activate', user.Fullname)}
                                                >
                                                    Activate
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            className="page-btn"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            Previous
                        </button>

                        <span className="page-info">
                            Page {currentPage} of {totalPages}
                        </span>

                        <button
                            className="page-btn"
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* Confirmation Dialog */}
            {confirmDialog.show && (
                <div className="dialog-overlay">
                    <div className="confirm-dialog">
                        <h3>Confirm Action</h3>
                        <p>
                            Are you sure you want to {confirmDialog.action} user "{confirmDialog.userName}"?
                        </p>
                        <div className="dialog-buttons">
                            <button className="dialog-btn cancel" onClick={closeConfirmDialog}>
                                Cancel
                            </button>
                            <button
                                className={`dialog-btn confirm ${confirmDialog.action}`}
                                onClick={handleConfirmAction}
                            >
                                {confirmDialog.action === 'activate' ? 'Activate' : 'Deactivate'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminDashboard

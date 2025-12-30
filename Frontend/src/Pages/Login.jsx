import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Login.css'
import { API_BASE_URL } from '../config'

function Login() {
    const navigate = useNavigate()

    // Form state
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    // Error state
    const [errors, setErrors] = useState({})
    const [serverError, setServerError] = useState('')

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    // Validate form
    const validateForm = () => {
        const newErrors = {}

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address'
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault()
        setServerError('')

        if (!validateForm()) {
            return
        }
        const email = e.target.email.value
        const password = e.target.password.value

        try {
            const response = await axios.post(`${API_BASE_URL}/login`, {
                email,
                password
            },{
                withCredentials: true
            })
            console.log(response)
            navigate('/dashboard')
            
        } catch (error) {
            const errorResponse = error.response.data;
            setServerError(errorResponse.message);
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">
                {/* Header */}
                <div className="login-header">
                    <h2 className="login-title">Welcome Back</h2>
                    <p className="login-subtitle">Sign in to your account</p>
                </div>

                {/* Server Error Display */}
                {serverError && (
                    <div className="error-message server-error">
                        {serverError}
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="login-form" noValidate>
                    {/* Email Field */}
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`form-input ${errors.email ? 'input-error' : ''}`}
                            placeholder="Enter your email"
                            autoComplete="email"
                        />
                        {errors.email && (
                            <span className="error-text">{errors.email}</span>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`form-input ${errors.password ? 'input-error' : ''}`}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                        />
                        {errors.password && (
                            <span className="error-text">{errors.password}</span>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="submit-button">
                        Sign In
                    </button>
                </form>

                {/* Link to Signup */}
                <div className="login-footer">
                    <p className="footer-text">
                        Don't have an account?{' '}
                        <Link to="/signin" className="footer-link">
                            Sign up here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
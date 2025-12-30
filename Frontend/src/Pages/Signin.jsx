import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Signup.css'
import './Login.css'
import axios from 'axios'
import { API_BASE_URL } from '../config'

function Signin() {
    const navigate = useNavigate()

    // Form state
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
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

    // Check password strength
    const getPasswordStrength = (password) => {
        let strength = 0
        if (password.length >= 8) strength++
        if (/[a-z]/.test(password)) strength++
        if (/[A-Z]/.test(password)) strength++
        if (/[0-9]/.test(password)) strength++
        if (/[^a-zA-Z0-9]/.test(password)) strength++

        if (strength <= 2) return { level: 'weak', text: 'Weak password' }
        if (strength <= 3) return { level: 'medium', text: 'Medium strength' }
        return { level: 'strong', text: 'Strong password' }
    }

    // Validate form
    const validateForm = () => {
        const newErrors = {}

        // Full name validation
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required'
        } else if (formData.fullName.trim().length < 2) {
            newErrors.fullName = 'Full name must be at least 2 characters'
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address'
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required'
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters'
        } else {
            const strength = getPasswordStrength(formData.password)
            if (strength.level === 'weak') {
                newErrors.password = 'Password is too weak. Include uppercase, lowercase, numbers, and special characters.'
            }
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password'
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
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

        try {
            const Fullname = formData.fullName;
            const email = formData.email;
            const password = formData.password;
            const confirmPassword = formData.confirmPassword;

            const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
                Fullname,
                email,
                password: confirmPassword
            })
            console.log(response)
            navigate('/login')

        }
        catch (error) {
            console.log(error)
            setServerError(error.response.data.message)
        }
    }

    // Calculate password strength for display
    const passwordStrength = formData.password ? getPasswordStrength(formData.password) : null

    return (
        <div className="signup-container">
            <div className="signup-card">
                {/* Header */}
                <div className="signup-header">
                    <h2 className="signup-title">Create Account</h2>
                    <p className="signup-subtitle">Sign up to get started</p>
                </div>

                {/* Server Error Display */}
                {serverError && (
                    <div className="error-message server-error">
                        {serverError}
                    </div>
                )}

                {/* Signup Form */}
                <form onSubmit={handleSubmit} className="signup-form" noValidate>
                    {/* Full Name Field */}
                    <div className="form-group">
                        <label htmlFor="fullName" className="form-label">
                            Full Name <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className={`form-input ${errors.fullName ? 'input-error' : ''}`}
                            placeholder="Enter your full name"
                            autoComplete="name"
                        />
                        {errors.fullName && (
                            <span className="error-text">{errors.fullName}</span>
                        )}
                    </div>

                    {/* Email Field */}
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            Email Address <span className="required">*</span>
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
                            Password <span className="required">*</span>
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`form-input ${errors.password ? 'input-error' : ''}`}
                            placeholder="Create a password"
                            autoComplete="new-password"
                        />
                        {errors.password && (
                            <span className="error-text">{errors.password}</span>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">
                            Confirm Password <span className="required">*</span>
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                            placeholder="Confirm your password"
                            autoComplete="new-password"
                        />
                        {errors.confirmPassword && (
                            <span className="error-text">{errors.confirmPassword}</span>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="submit-button">
                        Create Account
                    </button>
                </form>

                {/* Link to Login */}
                <div className="signup-footer">
                    <p className="footer-text">
                        Already have an account?{' '}
                        <Link to="/login" className="footer-link">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Signin
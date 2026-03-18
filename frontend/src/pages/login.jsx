import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../services/authService'
import { useAuth } from '../context/AuthContext'

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const { loginUser } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const data = await login(form)
            loginUser(data)
            navigate('/')
        } catch (err) {
            setError('Invalid email or password')
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl border border-gray-200 w-full max-w-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    Welcome back
                </h1>
                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm text-gray-600 mb-1 block">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-orange-400"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600 mb-1 block">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-orange-400"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-orange-500 text-white py-2 rounded-lg text-sm hover:bg-orange-600">
                        Login
                    </button>
                </form>
                <p className="text-sm text-gray-500 mt-4 text-center">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-orange-500 hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    )
}
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
        <div className="flex-1 w-full flex items-center justify-center p-6 mt-16 animate-fade-in text-slate-200">
            <div className="glass p-10 md:p-14 rounded-3xl w-full max-w-lg relative overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/5">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="text-center mb-10">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center shadow-inner border border-white/5">
                            <span className="text-3xl">👋</span>
                        </div>
                    </div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">
                        Welcome back
                    </h1>
                    <p className="text-slate-400 font-medium mt-3">Sign in to your account to continue</p>
                </div>

                {error && (
                    <div className="bg-red-950/50 border border-red-500/30 text-red-400 p-4 rounded-xl mb-8 text-sm flex items-center gap-3 font-medium">
                        <span className="text-lg">⚠️</span> {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div>
                        <label className="text-sm font-semibold text-slate-300 mb-2 block">
                            Email address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full glass-input text-base py-3"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-300 mb-2 block">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="w-full glass-input text-base py-3"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn-gradient w-full py-3.5 mt-4 text-base font-semibold shadow-indigo-500/25 tracking-wide">
                        Log in to Dashboard
                    </button>
                </form>
                
                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                    <p className="text-sm text-slate-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-indigo-400 font-semibold hover:text-fuchsia-400 transition-colors">
                            Create one now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
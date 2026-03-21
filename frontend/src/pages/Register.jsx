import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../services/authService'
import { useAuth } from '../context/AuthContext'

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '' })
    const [error, setError] = useState('')
    const { loginUser } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const data = await register(form)
            loginUser(data)
            navigate('/')
        } catch (err) {
            setError('Email already exists or something went wrong')
        }
    }

    return (
        <div className="flex-1 w-full flex items-center justify-center p-6 mt-8 animate-fade-in">
            <div className="bg-[#101117] p-8 md:p-10 rounded-2xl w-full max-w-[420px] shadow-2xl border border-white/5">
                
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-fuchsia-400 to-purple-500 bg-clip-text text-transparent mb-2">
                        Inkdrop
                    </h1>
                    <p className="text-slate-500 text-xs font-medium">Join thousands of creative writers</p>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                        Create your account ✨
                    </h2>
                </div>

                {error && (
                    <div className="bg-red-950/50 border border-red-500/30 text-red-400 p-3 rounded-lg mb-6 text-sm flex items-center gap-2 font-medium">
                        <span>⚠️</span> {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="text-xs font-bold text-slate-300 mb-1.5 block">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full bg-[#151821] border border-white/5 focus:bg-[#1A1D27] focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all rounded-lg px-3.5 py-2.5 text-sm outline-none text-slate-200 placeholder-slate-600"
                            placeholder="Your full name"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-300 mb-1.5 block">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full bg-[#151821] border border-white/5 focus:bg-[#1A1D27] focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all rounded-lg px-3.5 py-2.5 text-sm outline-none text-slate-200 placeholder-slate-600"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-300 mb-1.5 block">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="w-full bg-[#151821] border border-white/5 focus:bg-[#1A1D27] focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all rounded-lg px-3.5 py-2.5 text-sm outline-none text-slate-200 placeholder-slate-600"
                            placeholder="Choose a strong password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-300 hover:to-pink-400 text-white py-2.5 mt-2 rounded-full text-sm font-bold transition-all duration-300">
                        Create Account →
                    </button>
                </form>
                
                <div className="mt-6 text-center">
                    <p className="text-xs text-slate-500 font-medium">
                        Already have an account?{' '}
                        <Link to="/login" className="text-purple-400 hover:text-purple-300 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../services/authService'
import { useAuth } from '../context/AuthContext'

const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola",
    "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
    "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados",
    "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
    "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei",
    "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
    "Cameroon", "Canada", "Central African Republic", "Chad", "Chile",
    "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica",
    "Croatia", "Cuba", "Cyprus", "Czechia", "Democratic Republic of the Congo",
    "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador",
    "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia",
    "Eswatini", "Ethiopia", "Fiji", "Finland", "France",
    "Gabon", "Gambia", "Georgia", "Germany", "Ghana",
    "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
    "Guyana", "Haiti", "Holy See", "Honduras", "Hungary",
    "Iceland", "India", "Indonesia", "Iran", "Iraq",
    "Ireland", "Israel", "Italy", "Jamaica", "Japan",
    "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait",
    "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho",
    "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
    "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali",
    "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico",
    "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro",
    "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru",
    "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger",
    "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman",
    "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea",
    "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
    "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis",
    "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe",
    "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone",
    "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
    "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka",
    "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
    "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo",
    "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
    "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom",
    "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela",
    "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

export default function Register() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        username: '',
        gender: '',
        country: '',
        dateOfBirth: ''
    })
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
            console.error('Registration Error:', err)
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message)
            } else if (err.response && typeof err.response.data === 'string') {
                setError(err.response.data)
            } else {
                setError(err.message || 'Registration failed. Please try again.')
            }
        }
    }

    return (
        <div className="flex-1 w-full flex items-center justify-center p-6 mt-8 mb-16 animate-fade-in text-slate-200">
            <div className="glass p-8 md:p-12 rounded-3xl w-full max-w-2xl relative overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/5">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center shadow-inner border border-white/5">
                            <span className="text-3xl">✨</span>
                        </div>
                    </div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">
                        Create account
                    </h1>
                    <p className="text-slate-400 font-medium mt-3">Join our community today</p>
                </div>

                {error && (
                    <div className="bg-red-950/50 border border-red-500/30 text-red-400 p-4 rounded-xl mb-8 text-sm flex items-center gap-3 font-medium">
                        <span className="text-lg">⚠️</span> {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-semibold text-slate-300 mb-2 block">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                placeholder="Your full name"
                                className="w-full glass-input text-base py-3"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-300 mb-2 block">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                required
                                placeholder="@username"
                                className="w-full glass-input text-base py-3"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-sm font-semibold text-slate-300 mb-2 block">
                                Email address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                placeholder="you@example.com"
                                className="w-full glass-input text-base py-3"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-sm font-semibold text-slate-300 mb-2 block">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                placeholder="Choose a strong password"
                                className="w-full glass-input text-base py-3"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-300 mb-2 block">
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={form.dateOfBirth}
                                onChange={handleChange}
                                required
                                className="w-full glass-input text-base py-3 [&::-webkit-calendar-picker-indicator]:invert hover:[&::-webkit-calendar-picker-indicator]:opacity-75"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-300 mb-2 block">
                                Gender
                            </label>
                            <select
                                name="gender"
                                value={form.gender}
                                onChange={handleChange}
                                required
                                className="w-full glass-input text-base py-3 [&>option]:bg-slate-800 [&>option]:text-slate-200">
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                                <option value="Prefer not to say">
                                    Prefer not to say
                                </option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-sm font-semibold text-slate-300 mb-2 block">
                                Country
                            </label>
                            <select
                                name="country"
                                value={form.country}
                                onChange={handleChange}
                                required
                                className="w-full glass-input text-base py-3 [&>option]:bg-slate-800 [&>option]:text-slate-200">
                                <option value="">Select country</option>
                                {countries.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <button
                        type="submit"
                        className="btn-gradient w-full py-3.5 mt-2 text-base font-semibold shadow-indigo-500/25 tracking-wide">
                        Create Account
                    </button>
                </form>
                
                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                    <p className="text-sm text-slate-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-indigo-400 font-semibold hover:text-fuchsia-400 transition-colors">
                            Log in instead
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
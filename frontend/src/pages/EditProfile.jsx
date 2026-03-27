import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { updateProfile, changePassword } from '../services/userService'

const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola",
    "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
    "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus",
    "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
    "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria",
    "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada",
    "Chile", "China", "Colombia", "Croatia", "Cuba",
    "Cyprus", "Czechia", "Denmark", "Dominican Republic", "Ecuador",
    "Egypt", "El Salvador", "Estonia", "Ethiopia", "Fiji",
    "Finland", "France", "Germany", "Ghana", "Greece",
    "Guatemala", "Haiti", "Honduras", "Hungary", "Iceland",
    "India", "Indonesia", "Iran", "Iraq", "Ireland",
    "Israel", "Italy", "Jamaica", "Japan", "Jordan",
    "Kazakhstan", "Kenya", "Kuwait", "Kyrgyzstan", "Laos",
    "Latvia", "Lebanon", "Libya", "Lithuania", "Luxembourg",
    "Malaysia", "Maldives", "Mali", "Malta", "Mexico",
    "Moldova", "Mongolia", "Montenegro", "Morocco", "Mozambique",
    "Myanmar", "Namibia", "Nepal", "Netherlands", "New Zealand",
    "Nicaragua", "Nigeria", "North Korea", "Norway", "Oman",
    "Pakistan", "Panama", "Paraguay", "Peru", "Philippines",
    "Poland", "Portugal", "Qatar", "Romania", "Russia",
    "Rwanda", "Saudi Arabia", "Senegal", "Serbia", "Singapore",
    "Slovakia", "Slovenia", "Somalia", "South Africa", "South Korea",
    "Spain", "Sri Lanka", "Sudan", "Sweden", "Switzerland",
    "Syria", "Taiwan", "Tanzania", "Thailand", "Tunisia",
    "Turkey", "Uganda", "Ukraine", "United Arab Emirates",
    "United Kingdom", "United States", "Uruguay", "Uzbekistan",
    "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
]

export default function EditProfile() {
    const { user, loginUser } = useAuth()
    const navigate = useNavigate()

    const [profileForm, setProfileForm] = useState({
        name: '',
        username: '',
        bio: '',
        country: ''
    })

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const [profileLoading, setProfileLoading] = useState(false)
    const [passwordLoading, setPasswordLoading] = useState(false)
    const [profileSuccess, setProfileSuccess] = useState('')
    const [profileError, setProfileError] = useState('')
    const [passwordSuccess, setPasswordSuccess] = useState('')
    const [passwordError, setPasswordError] = useState('')

    useEffect(() => {
        if (!user) navigate('/login')
        else {
            setProfileForm({
                name: user.name || '',
                username: user.username || '',
                bio: user.bio || '',
                country: user.country || ''
            })
        }
    }, [])

    const handleProfileChange = (e) => {
        setProfileForm({ ...profileForm, [e.target.name]: e.target.value })
    }

    const handlePasswordChange = (e) => {
        setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value })
    }

    const handleProfileSubmit = async (e) => {
        e.preventDefault()
        console.log('Token:', localStorage.getItem('token'))
        console.log('User:', JSON.stringify(localStorage.getItem('user')))
        setProfileLoading(true)
        setProfileError('')
        setProfileSuccess('')
        try {
            const updatedUser = await updateProfile(profileForm)
            loginUser({
                ...user,
                name: updatedUser.name,
                username: updatedUser.username,
                bio: updatedUser.bio,
                country: updatedUser.country
            })
            setProfileSuccess('Profile updated successfully!')
        } catch (err) {
            setProfileError(
                err.response?.data?.message ||
                err.response?.data ||
                'Failed to update profile'
            )
        } finally {
            setProfileLoading(false)
        }
    }

    const handlePasswordSubmit = async (e) => {
        e.preventDefault()
        setPasswordLoading(true)
        setPasswordError('')
        setPasswordSuccess('')
        try {
            await changePassword(passwordForm)
            setPasswordSuccess('Password changed successfully!')
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            })
        } catch (err) {
            setPasswordError(
                err.response?.data?.message ||
                err.response?.data ||
                'Failed to change password'
            )
        } finally {
            setPasswordLoading(false)
        }
    }

    return (
        <div className="flex-1 w-full">
            <Navbar />
            <div className="max-w-2xl mx-auto px-6 py-10 animate-fade-in">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/profile')}
                        className="text-slate-400 hover:text-white transition-colors">
                        ← Back
                    </button>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">
                        Edit Profile
                    </h1>
                </div>

                {/* Profile Section */}
                <div className="glass p-8 rounded-3xl mb-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 opacity-90"></div>

                    {/* Avatar */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-20 h-20 rounded-full bg-indigo-500/20 border-2 border-indigo-500/30 flex items-center justify-center text-3xl font-bold text-indigo-400">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                {user?.name}
                            </h2>
                            <p className="text-slate-400 text-sm">
                                {user?.email}
                            </p>
                        </div>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <span>👤</span> Basic Information
                    </h3>

                    {profileSuccess && (
                        <div className="bg-green-950/50 border border-green-500/30 text-green-400 p-4 rounded-xl mb-6 text-sm flex items-center gap-3 font-medium">
                            <span>✅</span> {profileSuccess}
                        </div>
                    )}

                    {profileError && (
                        <div className="bg-red-950/50 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-sm flex items-center gap-3 font-medium">
                            <span>⚠️</span> {typeof profileError === 'string' ? profileError : 'Failed to update profile'}
                        </div>
                    )}

                    <form onSubmit={handleProfileSubmit} className="flex flex-col gap-5">
                        <div>
                            <label className="text-sm font-semibold text-slate-300 mb-2 block">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={profileForm.name}
                                onChange={handleProfileChange}
                                required
                                placeholder="Your full name"
                                className="w-full glass-input py-3"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-300 mb-2 block">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={profileForm.username}
                                onChange={handleProfileChange}
                                placeholder="@username"
                                className="w-full glass-input py-3"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-300 mb-2 block">
                                Bio
                            </label>
                            <textarea
                                name="bio"
                                value={profileForm.bio}
                                onChange={handleProfileChange}
                                rows={3}
                                placeholder="Tell readers about yourself..."
                                className="w-full glass-input py-3 resize-none"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-300 mb-2 block">
                                Country
                            </label>
                            <select
                                name="country"
                                value={profileForm.country}
                                onChange={handleProfileChange}
                                className="w-full glass-input py-3 [&>option]:bg-slate-800">
                                <option value="">Select country</option>
                                {countries.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={profileLoading}
                            className="btn-gradient py-3 text-base font-semibold mt-2">
                            {profileLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>

                {/* Password Section */}
                <div className="glass p-8 rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 opacity-90"></div>

                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <span>🔒</span> Change Password
                    </h3>

                    {passwordSuccess && (
                        <div className="bg-green-950/50 border border-green-500/30 text-green-400 p-4 rounded-xl mb-6 text-sm flex items-center gap-3 font-medium">
                            <span>✅</span> {passwordSuccess}
                        </div>
                    )}

                    {passwordError && (
                        <div className="bg-red-950/50 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-sm flex items-center gap-3 font-medium">
                            <span>⚠️</span> {typeof passwordError === 'string' ? passwordError : 'Failed to change password'}
                        </div>
                    )}

                    <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-5">
                        <div>
                            <label className="text-sm font-semibold text-slate-300 mb-2 block">
                                Current Password
                            </label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={passwordForm.currentPassword}
                                onChange={handlePasswordChange}
                                required
                                placeholder="••••••••"
                                className="w-full glass-input py-3"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-300 mb-2 block">
                                New Password
                            </label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwordForm.newPassword}
                                onChange={handlePasswordChange}
                                required
                                placeholder="••••••••"
                                className="w-full glass-input py-3"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-300 mb-2 block">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={passwordForm.confirmPassword}
                                onChange={handlePasswordChange}
                                required
                                placeholder="••••••••"
                                className="w-full glass-input py-3"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={passwordLoading}
                            className="btn-gradient py-3 text-base font-semibold mt-2">
                            {passwordLoading ? 'Changing...' : 'Change Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
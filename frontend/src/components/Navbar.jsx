import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
    const { user, logoutUser } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logoutUser()
        navigate('/')
    }

    return (
        <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-orange-500">
                Inkdrop
            </Link>

            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        <Link to="/write" className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600">
                            Write Post
                        </Link>
                        <Link to="/bookmarks" className="text-gray-600 hover:text-gray-900 text-sm">
                            Bookmarks
                        </Link>
                        <Link to={`/profile`} className="text-gray-600 hover:text-gray-900 text-sm">
                            Profile
                        </Link>
                        {user.role === 'admin' && (
                            <Link to="/admin" className="text-red-500 hover:text-red-700 text-sm">
                                Admin
                            </Link>
                        )}
                        <button
                            onClick={handleLogout}
                            className="text-gray-600 hover:text-gray-900 text-sm">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-gray-600 hover:text-gray-900 text-sm">
                            Login
                        </Link>
                        <Link to="/register" className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600">
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    )
}
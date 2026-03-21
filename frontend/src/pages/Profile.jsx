import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import BlogCard from '../components/BlogCard'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

export default function Profile() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) navigate('/login')
        else loadUserPosts()
    }, [])

    const loadUserPosts = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/users/${user.id}/posts`
            )
            setPosts(response.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex-1 w-full">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 py-10 animate-fade-in">
                {/* Profile Header */}
                <div className="glass p-8 rounded-3xl mb-12 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 rounded-bl-full -mr-8 -mt-8"></div>
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-fuchsia-500 rounded-2xl flex items-center justify-center text-white text-3xl font-extrabold shadow-lg shadow-indigo-500/30 transform group-hover:rotate-3 transition-transform">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold text-white tracking-tight">
                                {user?.name}
                            </h1>
                            <p className="text-slate-400 font-medium">{user?.email}</p>
                            {user?.bio && (
                                <p className="text-slate-300 mt-2">{user?.bio}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* User Posts */}
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">📝</span>
                    <h2 className="text-2xl font-bold text-white">
                        My Posts <span className="text-indigo-400 font-medium text-lg">({posts.length})</span>
                    </h2>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-70">
                        <div className="w-10 h-10 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-indigo-600 font-medium animate-pulse">
                            Loading your stories...
                        </p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="glass-card text-center py-16 flex flex-col items-center justify-center">
                        <span className="text-6xl mb-4 opacity-70">✍️</span>
                        <h3 className="text-xl font-bold text-white mb-2">No posts yet</h3>
                        <p className="text-slate-400 mb-6">You haven't shared any stories with the community yet.</p>
                        <button
                            onClick={() => navigate('/write')}
                            className="btn-gradient">
                            Write your first post
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {posts.map(post => (
                            <BlogCard key={post.id} post={post} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
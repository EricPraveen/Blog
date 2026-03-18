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
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 py-8">

                {/* Profile Header */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 text-2xl font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">
                                {user?.name}
                            </h1>
                            <p className="text-gray-500 text-sm">{user?.email}</p>
                            {user?.bio && (
                                <p className="text-gray-600 text-sm mt-1">{user?.bio}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* User Posts */}
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                    My Posts ({posts.length})
                </h2>

                {loading ? (
                    <div className="text-center text-gray-400 py-20">
                        Loading...
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center text-gray-400 py-20">
                        <p>You haven't written any posts yet</p>
                        <button
                            onClick={() => navigate('/write')}
                            className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg text-sm hover:bg-orange-600">
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
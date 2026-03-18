import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import BlogCard from '../components/BlogCard'
import { getBookmarks } from '../services/bookmarkService'
import { useAuth } from '../context/AuthContext'

export default function Bookmarks() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [bookmarks, setBookmarks] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) navigate('/login')
        else loadBookmarks()
    }, [])

    const loadBookmarks = async () => {
        try {
            const data = await getBookmarks()
            setBookmarks(data)
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
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    My Bookmarks
                </h1>

                {loading ? (
                    <div className="text-center text-gray-400 py-20">
                        Loading...
                    </div>
                ) : bookmarks.length === 0 ? (
                    <div className="text-center text-gray-400 py-20">
                        <p>No bookmarks yet</p>
                        <button
                            onClick={() => navigate('/')}
                            className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg text-sm hover:bg-orange-600">
                            Discover Posts
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {bookmarks.map(bookmark => (
                            <BlogCard key={bookmark.id} post={bookmark.post} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
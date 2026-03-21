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
        <div className="flex-1 w-full">
            <Navbar />
            <div className="max-w-6xl mx-auto px-6 py-10 animate-fade-in">
                <div className="flex items-center gap-3 mb-8">
                    <span className="text-3xl">🔖</span>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">
                        My Bookmarks
                    </h1>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-70">
                        <div className="w-10 h-10 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-indigo-600 font-medium animate-pulse">
                            Loading your saved stories...
                        </p>
                    </div>
                ) : bookmarks.length === 0 ? (
                    <div className="glass-card text-center py-20 flex flex-col items-center justify-center max-w-2xl mx-auto mt-10">
                        <span className="text-6xl mb-4 opacity-70">📚</span>
                        <h3 className="text-xl font-bold text-white mb-2">Your reading list is empty</h3>
                        <p className="text-slate-400 mb-6">Save posts you want to read later by clicking the bookmark icon.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="btn-gradient">
                            Discover Posts
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bookmarks.map(bookmark => (
                            <BlogCard key={bookmark.id} post={bookmark.post} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
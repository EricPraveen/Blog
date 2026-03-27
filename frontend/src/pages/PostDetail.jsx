import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getPostById } from '../services/postService'
import { toggleBookmark } from '../services/bookmarkService'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { getGenreColor } from '../utils/genreColors'

export default function PostDetail() {
    const { id } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const [liked, setLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(0)
    const [bookmarked, setBookmarked] = useState(false)

    useEffect(() => {
        loadPost()
    }, [id])

    const loadPost = async () => {
        try {
            const data = await getPostById(id)
            setPost(data)
            setLikeCount(data.likeCount)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleLike = async () => {
        if (!user) return navigate('/login')
        try {
            await axios.post(
                `http://localhost:8080/api/posts/${id}/like`,
                {},
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            )
            setLiked(!liked)
            setLikeCount(liked ? likeCount - 1 : likeCount + 1)
        } catch (err) {
            console.error(err)
        }
    }

    const handleBookmark = async () => {
        if (!user) return navigate('/login')
        try {
            await toggleBookmark(id)
            setBookmarked(!bookmarked)
        } catch (err) {
            console.error(err)
        }
    }

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this post?')) return
        try {
            await axios.delete(
                `http://localhost:8080/api/posts/${id}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            )
            navigate('/')
        } catch (err) {
            console.error(err)
        }
    }

    if (loading) return (
        <div className="flex-1 w-full">
            <Navbar />
            <div className="flex flex-col items-center justify-center py-20 opacity-70">
                <div className="w-10 h-10 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-indigo-600 font-medium animate-pulse">Loading post...</p>
            </div>
        </div>
    )

    if (!post) return (
        <div className="flex-1 w-full">
            <Navbar />
            <div className="glass-card text-center py-20 mx-auto max-w-3xl mt-12 flex flex-col items-center justify-center">
                <span className="text-6xl mb-4 opacity-50">📭</span>
                <h3 className="text-xl font-bold text-gray-700 mb-2">Post not found</h3>
            </div>
        </div>
    )

    return (
        <div className="flex-1 w-full">
            <Navbar />
            <div className="max-w-3xl mx-auto px-6 py-10 animate-fade-in">
                <div className="glass p-8 rounded-3xl">
                    {/* Genre */}
                    <span className={`${getGenreColor(post.genre)} border text-xs px-4 py-1.5 rounded-full font-medium inline-block mb-4`}>
                        {post.genre}
                    </span>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
                        {post.title}
                    </h1>

                    {/* Author & Date */}
                    <div className="flex items-center gap-4 text-sm text-slate-400 mb-8 font-medium">
                        <span className="flex items-center gap-1">
                    <span className="text-lg">✍️</span>
                    {post.isAnonymous ? 'Anonymous' : (
                        <Link
                            to={`/user/${post.authorId}`}
                            className="hover:text-indigo-400 transition-colors">
                            {post.authorName}
                        </Link>
                    )}
                    </span>
                        <span className="flex items-center gap-1">
                            <span className="text-lg">📅</span> 
                            {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                    </div>

                    {/* Cover Image */}
                    {post.coverImage && (
                        <div className="overflow-hidden rounded-2xl mb-8 shadow-sm">
                            <img
                                src={post.coverImage}
                                alt={post.title}
                                className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div
                        className="prose prose-lg prose-invert max-w-none text-slate-300 leading-relaxed font-sans"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-4 mt-10 pt-8 border-t border-white/10">
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 shadow-sm
                                ${liked
                                    ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30'
                                    : 'btn-glass text-slate-300'
                                }`}>
                            <span className={liked ? 'animate-bounce text-fuchsia-400' : 'text-slate-400'}>♥</span> {likeCount} Likes
                        </button>

                        <button
                            onClick={handleBookmark}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 shadow-sm
                                ${bookmarked
                                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                    : 'btn-glass text-slate-300'
                                }`}>
                            {bookmarked ? '🔖 Saved' : '🔖 Save'}
                        </button>

                        {user && (
                            (user.email && post.authorEmail && user.email === post.authorEmail) ||
                            (user.id && post.authorId && user.id === post.authorId)
                        ) && (
                            <div className="flex gap-4 ml-auto">
                                <button
                                    onClick={() => navigate(`/write?edit=${post.id}`)}
                                    className="btn-glass text-indigo-400">
                                    Edit
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-5 py-2.5 rounded-xl text-sm font-medium border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 transition-all shadow-sm">
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
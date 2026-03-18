import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getPostById } from '../services/postService'
import { toggleBookmark } from '../services/bookmarkService'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

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
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="text-center text-gray-400 py-20">Loading...</div>
        </div>
    )

    if (!post) return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="text-center text-gray-400 py-20">Post not found</div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-3xl mx-auto px-6 py-8">

                {/* Genre */}
                <span className="bg-orange-100 text-orange-600 text-xs px-3 py-1 rounded-full">
                    {post.genre}
                </span>

                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-800 mt-4 mb-2">
                    {post.title}
                </h1>

                {/* Author & Date */}
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                    <span>By {post.isAnonymous ? 'Anonymous' : post.authorName}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>

                {/* Cover Image */}
                {post.coverImage && (
                    <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-64 object-cover rounded-xl mb-6"
                    />
                )}

                {/* Content */}
                <div
                    className="prose max-w-none text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Actions */}
                <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-200">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition
                            ${liked
                                ? 'bg-red-50 text-red-500 border-red-300'
                                : 'bg-white text-gray-500 border-gray-300 hover:border-red-300'
                            }`}>
                        ♥ {likeCount} Likes
                    </button>

                    <button
                        onClick={handleBookmark}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition
                            ${bookmarked
                                ? 'bg-orange-50 text-orange-500 border-orange-300'
                                : 'bg-white text-gray-500 border-gray-300 hover:border-orange-300'
                            }`}>
                        {bookmarked ? '🔖 Saved' : '🔖 Save'}
                    </button>

                    {user && user.email === post.authorEmail && (
                        <>
                            <button
                                onClick={() => navigate(`/write?edit=${post.id}`)}
                                className="px-4 py-2 rounded-lg text-sm border border-gray-300 hover:border-orange-400 text-gray-500">
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 rounded-lg text-sm border border-red-300 text-red-500 hover:bg-red-50">
                                Delete
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
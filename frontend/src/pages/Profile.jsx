import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import BlogCard from '../components/BlogCard'
import { useAuth } from '../context/AuthContext'
import { getPostsByUserId, getDrafts, publishPost, deletePost } from '../services/postService'

export default function Profile() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [posts, setPosts] = useState([])
    const [drafts, setDrafts] = useState([])
    const [activeTab, setActiveTab] = useState('published')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) {
            navigate('/login')
        } else {
            // Verify token exists before making requests
            const token = localStorage.getItem('token')
            if (!token) {
                console.error('Token not found - redirecting to login')
                navigate('/login')
                return
            }
            loadPosts()
            loadDrafts()
        }
    }, [user, navigate])

    const loadPosts = async () => {
        try {
            const response = await getPostsByUserId(user.id)
            setPosts(response)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const loadDrafts = async () => {
        try {
            const data = await getDrafts()
            setDrafts(data)
        } catch (err) {
            console.error('Error loading drafts:', err)
            if (err.response?.status === 401 || err.response?.status === 403) {
                console.error('Authentication failed. Please login again.')
                navigate('/login')
            }
        }
    }

    const handlePublish = async (id) => {
        try {
            const published = drafts.find(d => d.id === id)
            await publishPost(id, published)
            setDrafts(drafts.filter(d => d.id !== id))
            if (published) setPosts([...posts, { ...published, status: 'published' }])
            alert('Post published successfully!')
        } catch (err) {
            console.error(err)
            alert('Failed to publish post: ' + err.message)
        }
    }

    const handleDeleteDraft = async (id) => {
        if (!window.confirm('Delete this draft?')) return
        try {
            await deletePost(id)
            setDrafts(drafts.filter(d => d.id !== id))
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="page-wrapper">
            <Navbar />
            <div className="page-container max-w-4xl mx-auto w-full px-6" style={{ paddingTop: '2rem' }}>

                {/* Profile Header */}
                <div className="glass-card p-6 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-2xl font-bold text-indigo-400">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-xl font-bold text-white">
                                {user?.name}
                            </h1>
                            <p className="text-slate-400 text-sm">
                                @{user?.username || user?.email}
                            </p>
                            {user?.bio && (
                                <p className="text-slate-300 text-sm mt-2">
                                    {user?.bio}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={() => navigate('/edit-profile')}
                            className="text-xs px-4 py-2 rounded-full border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 transition-colors">
                            ✏️ Edit Profile
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab('published')}
                        className={`px-5 py-2 rounded-full text-sm font-medium border transition
                            ${activeTab === 'published'
                                ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                                : 'text-slate-400 border-white/10 hover:border-white/20'
                            }`}>
                        Published ({posts.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('drafts')}
                        className={`px-5 py-2 rounded-full text-sm font-medium border transition
                            ${activeTab === 'drafts'
                                ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                                : 'text-slate-400 border-white/10 hover:border-white/20'
                            }`}>
                        Drafts ({drafts.length})
                    </button>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="text-center text-slate-400 py-20">
                        Loading...
                    </div>
                ) : activeTab === 'published' ? (
                    posts.length === 0 ? (
                        <div className="text-center text-slate-400 py-20">
                            <p className="mb-4">No published posts yet</p>
                            <button
                                onClick={() => navigate('/write')}
                                className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-6 py-2 rounded-full text-sm hover:bg-indigo-500/30">
                                Write your first post
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {posts.map(post => (
                                <BlogCard
                                    key={post.id}
                                    post={post}
                                    onDelete={(id) => setPosts(posts.filter(p => p.id !== id))}
                                />
                            ))}
                        </div>
                    )
                ) : (
                    drafts.length === 0 ? (
                        <div className="text-center text-slate-400 py-20">
                            <p>No drafts saved</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {drafts.map(draft => (
                                <div key={draft.id} className="glass-card p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-xs px-3 py-1 rounded-full">
                                            Draft
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            {draft.genre}
                                        </span>
                                    </div>
                                    <h2 className="text-lg font-bold text-white mb-2">
                                        {draft.title}
                                    </h2>
                                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                                        {draft.content?.replace(/<[^>]+>/g, '')}
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate(`/write?edit=${draft.id}`)}
                                            className="text-xs px-3 py-1 rounded-full border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 transition">
                                            ✏️ Edit
                                        </button>
                                        <button
                                            onClick={() => handlePublish(draft.id)}
                                            className="text-xs px-3 py-1 rounded-full border border-green-500/30 text-green-400 hover:bg-green-500/20 transition">
                                            🚀 Publish
                                        </button>
                                        <button
                                            onClick={() => handleDeleteDraft(draft.id)}
                                            className="text-xs px-3 py-1 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/20 transition">
                                            🗑 Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    )
}
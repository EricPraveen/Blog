import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import BlogCard from '../components/BlogCard'
import GenreFilter from '../components/GenreFilter'
import SearchBar from '../components/SearchBar'
import {
    getAllPosts,
    getPostsByGenre,
    searchPosts,
    getRandomPost,
    getFeaturedPosts
} from '../services/postService'

export default function Home() {
    const { user } = useAuth()
    const [posts, setPosts] = useState([])

    const getFormattedFullName = () => {
        if (!user) return 'Stories'
        const rawName = user.name || user.email?.split('@')[0] || 'User'
        return rawName.charAt(0).toUpperCase() + rawName.slice(1)
    }
    const [featured, setFeatured] = useState([])
    const [selectedGenre, setSelectedGenre] = useState('All')
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        loadPosts()
        loadFeatured()
    }, [])

    const loadPosts = async () => {
        try {
            const data = await getAllPosts()
            setPosts(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const loadFeatured = async () => {
        try {
            const data = await getFeaturedPosts()
            setFeatured(data)
        } catch (err) {
            console.error(err)
        }
    }

    const handleGenreSelect = async (genre) => {
        setSelectedGenre(genre)
        setLoading(true)
        try {
            const data = genre === 'All'
                ? await getAllPosts()
                : await getPostsByGenre(genre)
            setPosts(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = async (query) => {
        if (!query) return loadPosts()
        setLoading(true)
        try {
            const data = await searchPosts(query)
            setPosts(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleSurpriseMe = async () => {
        try {
            const post = await getRandomPost()
            navigate(`/post/${post.id}`)
        } catch (err) {
            alert('No posts available yet!')
        }
    }

    return (
        <div className="flex-1 w-full">
            <Navbar />
            <div className="max-w-6xl mx-auto px-6 py-10 animate-fade-in">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 glass p-8 rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
                            {user ? `Welcome, ` : 'Discover '}<span className="text-gradient">{getFormattedFullName()}</span>
                        </h1>
                        <p className="text-slate-300 text-lg font-medium">
                            {user ? 'Ready to read and share amazing blogs today?' : 'Read and share blogs from writers around the world'}
                        </p>
                    </div>
                    <button
                        onClick={handleSurpriseMe}
                        className="btn-gradient shadow-indigo-500/25 px-6 py-3 text-base flex items-center gap-2">
                        <span>🎲</span> Surprise Me
                    </button>
                </div>

                {featured.length > 0 && (
                    <div className="mb-12">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="text-2xl animate-bounce">🔥</span>
                            <h2 className="text-2xl font-bold text-white">
                                Featured Posts
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {featured.map(post => (
                                <BlogCard key={post.id} post={post} />
                            ))}
                        </div>
                    </div>
                )}

                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="text-2xl">✨</span>
                        <h2 className="text-2xl font-bold text-white">
                            Explore
                        </h2>
                    </div>
                    <SearchBar onSearch={handleSearch} />
                    <GenreFilter
                        selected={selectedGenre}
                        onSelect={handleGenreSelect}
                    />
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-70">
                        <div className="w-10 h-10 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-indigo-600 font-medium animate-pulse">Loading amazing posts...</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="glass-card text-center py-20 flex flex-col items-center justify-center">
                        <span className="text-6xl mb-4 opacity-50">📭</span>
                        <h3 className="text-xl font-bold text-slate-200 mb-2">No posts found</h3>
                        <p className="text-slate-400">Try adjusting your search or genre filters.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map(post => (
                            <BlogCard
                                key={post.id}
                                post={post}
                                onDelete={(id) => setPosts(prev => prev.filter(p => String(p.id) !== String(id)))}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
    const [posts, setPosts] = useState([])
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
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Discover Stories
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Read and share blogs from writers around the world
                        </p>
                    </div>
                    <button
                        onClick={handleSurpriseMe}
                        className="bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 text-sm">
                        Surprise Me
                    </button>
                </div>

                {featured.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">
                            Featured Posts
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {featured.map(post => (
                                <BlogCard key={post.id} post={post} />
                            ))}
                        </div>
                    </div>
                )}

                <SearchBar onSearch={handleSearch} />

                <GenreFilter
                    selected={selectedGenre}
                    onSelect={handleGenreSelect}
                />

                {loading ? (
                    <div className="text-center text-gray-400 py-20">
                        Loading posts...
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center text-gray-400 py-20">
                        No posts found
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map(post => (
                            <BlogCard key={post.id} post={post} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
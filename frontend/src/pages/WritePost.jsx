import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { createPost, updatePost, getPostById } from '../services/postService'
import { useAuth } from '../context/AuthContext'

const genres = [
    'Technology', 'Travel', 'Food', 'Lifestyle',
    'Fiction', 'Opinion', 'Health', 'Finance', 'Gaming', 'Culture'
]

export default function WritePost() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const editId = searchParams.get('edit')

    const [form, setForm] = useState({
        title: '',
        content: '',
        coverImage: '',
        genre: 'Technology',
        status: 'published',
        isAnonymous: false
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!user) navigate('/login')
        if (editId) loadPost()
    }, [])

    const loadPost = async () => {
        try {
            const data = await getPostById(editId)
            setForm({
                title: data.title,
                content: data.content,
                coverImage: data.coverImage || '',
                genre: data.genre,
                status: data.status,
                isAnonymous: data.isAnonymous
            })
        } catch (err) {
            console.error(err)
        }
    }

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox'
            ? e.target.checked
            : e.target.value
        setForm({ ...form, [e.target.name]: value })
    }

    const handleSaveDraft = async () => {
        setLoading(true)
        try {
            await createPost({ ...form, status: 'draft' })
            navigate('/')
        } catch (err) {
            setError('Failed to save draft')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            if (editId) {
                await updatePost(editId, form)
            } else {
                await createPost(form)
            }
            navigate('/')
        } catch (err) {
            setError('Failed to publish post')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-3xl mx-auto px-6 py-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    {editId ? 'Edit Post' : 'Write a Post'}
                </h1>

                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    {/* Title */}
                    <div>
                        <label className="text-sm text-gray-600 mb-1 block">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                            placeholder="Enter your post title..."
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-orange-400"
                        />
                    </div>

                    {/* Cover Image */}
                    <div>
                        <label className="text-sm text-gray-600 mb-1 block">
                            Cover Image URL (optional)
                        </label>
                        <input
                            type="text"
                            name="coverImage"
                            value={form.coverImage}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-orange-400"
                        />
                    </div>

                    {/* Genre */}
                    <div>
                        <label className="text-sm text-gray-600 mb-1 block">Genre</label>
                        <select
                            name="genre"
                            value={form.genre}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-orange-400">
                            {genres.map(g => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                    </div>

                    {/* Content */}
                    <div>
                        <label className="text-sm text-gray-600 mb-1 block">Content</label>
                        <textarea
                            name="content"
                            value={form.content}
                            onChange={handleChange}
                            required
                            rows={12}
                            placeholder="Write your blog post here..."
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-orange-400 resize-none"
                        />
                    </div>

                    {/* Anonymous */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="isAnonymous"
                            id="isAnonymous"
                            checked={form.isAnonymous}
                            onChange={handleChange}
                            className="w-4 h-4"
                        />
                        <label htmlFor="isAnonymous" className="text-sm text-gray-600">
                            Post anonymously
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleSaveDraft}
                            disabled={loading}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:border-orange-400">
                            Save as Draft
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-orange-500 text-white px-6 py-2 rounded-lg text-sm hover:bg-orange-600">
                            {loading ? 'Publishing...' : editId ? 'Update Post' : 'Publish Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
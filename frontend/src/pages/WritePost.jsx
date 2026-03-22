import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { createPost, updatePost, getPostById } from '../services/postService'
import { useAuth } from '../context/AuthContext'

const genres = [
    'Technology', 'Travel', 'Food', 'Lifestyle',
    'Fiction', 'Opinion', 'Health', 'Finance', 'Gaming', 'Culture', 'Else'
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
        <div className="flex-1 w-full">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 py-10 animate-fade-in">
                <div className="glass p-8 md:p-12 rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 opacity-90"></div>
                    
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-8 tracking-tight">
                        {editId ? 'Edit Post' : 'Write a Story'}
                    </h1>

                    {error && (
                        <div className="bg-red-50/80 border border-red-200 text-red-600 p-4 rounded-xl mb-8 flex items-center gap-3 font-medium">
                            <span className="text-xl">⚠️</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {/* Title */}
                        <div>
                            <label className="text-sm font-semibold text-slate-300 mb-2 block">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                required
                                placeholder="Enter a captivating title..."
                                className="w-full glass-input text-lg py-3"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Cover Image */}
                            <div>
                                <label className="text-sm font-semibold text-slate-300 mb-2 block">
                                    Cover Image URL <span className="text-slate-500 font-normal">(optional)</span>
                                </label>
                                <input
                                    type="text"
                                    name="coverImage"
                                    value={form.coverImage}
                                    onChange={handleChange}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full glass-input py-3"
                                />
                            </div>

                            {/* Genre */}
                            <div>
                                <label className="text-sm font-semibold text-slate-300 mb-2 block">Genre</label>
                                <select
                                    name="genre"
                                    value={form.genre}
                                    onChange={handleChange}
                                    className="w-full glass-input py-3 cursor-pointer [&>option]:bg-slate-800">
                                    {genres.map(g => (
                                        <option key={g} value={g}>{g}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Content */}
                        <div>
                            <label className="text-sm font-semibold text-slate-300 mb-2 block">Content</label>
                            <textarea
                                name="content"
                                value={form.content}
                                onChange={handleChange}
                                required
                                rows={14}
                                placeholder="Write your story here... HTML formatting is supported."
                                className="w-full glass-input py-4 text-base resize-y min-h-[300px]"
                            />
                        </div>

                        {/* Anonymous */}
                        <div className="flex items-center gap-3 mt-2 bg-slate-800/50 p-4 rounded-xl border border-white/10 w-max">
                            <input
                                type="checkbox"
                                name="isAnonymous"
                                id="isAnonymous"
                                checked={form.isAnonymous}
                                onChange={handleChange}
                                className="w-5 h-5 rounded text-indigo-500 focus:ring-indigo-500 cursor-pointer bg-slate-700 border-white/10"
                            />
                            <label htmlFor="isAnonymous" className="text-sm font-medium text-slate-300 cursor-pointer select-none">
                                Post anonymously
                            </label>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-white/10">
                            <button
                                type="button"
                                onClick={handleSaveDraft}
                                disabled={loading}
                                className="btn-glass px-8 py-3 text-base">
                                Save as Draft
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-gradient px-8 py-3 text-base">
                                {loading ? 'Publishing...' : editId ? 'Update Post' : 'Publish Post'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
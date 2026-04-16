import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { createPost, updatePost, getPostById } from '../services/postService'
import { useAuth } from '../context/AuthContext'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'

const genres = [
    'Technology', 'Travel', 'Food', 'Lifestyle',
    'Fiction', 'Opinion', 'Health', 'Finance',
    'Gaming', 'Culture', 'Sports', 'Else'
]

const ToolbarButton = ({ onClick, active, title, children }) => (
    <button
        type="button"
        onClick={onClick}
        title={title}
        className={`px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all
            ${active
                ? 'bg-indigo-500/40 text-indigo-300 border border-indigo-500/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50 border border-transparent'
            }`}>
        {children}
    </button>
)

export default function WritePost() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const editId = searchParams.get('edit')

    const [form, setForm] = useState({
        title: '',
        coverImage: '',
        genre: 'Technology',
        status: 'published',
        isAnonymous: false
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                underline: false
            }),
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph']
            }),
            Placeholder.configure({
                placeholder: 'Write your story here...'
            })
        ],
        content: '',
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px] text-slate-200 leading-relaxed'
            }
        }
    })

    useEffect(() => {
        if (!user) navigate('/login')
        if (editId) loadPost()
    }, [])

    const loadPost = async () => {
        try {
            const data = await getPostById(editId)
            setForm({
                title: data.title,
                coverImage: data.coverImage || '',
                genre: data.genre,
                status: data.status,
                isAnonymous: data.isAnonymous
            })
            if (editor && data.content) {
                editor.commands.setContent(data.content)
            }
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        if (editor && editId) {
            loadPost()
        }
    }, [editor])

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox'
            ? e.target.checked
            : e.target.value
        setForm({ ...form, [e.target.name]: value })
    }

    const getContent = useCallback(() => {
        if (editor) {
            return editor.getHTML()
        }
        return ''
    }, [editor])

    const handleSaveDraft = async () => {
        setLoading(true)
        try {
            const content = getContent()
            if (editId) {
                await updatePost(editId, { ...form, content, status: 'draft' })
            } else {
                await createPost({ ...form, content, status: 'draft' })
            }
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
            const content = getContent()
            if (editId) {
                await updatePost(editId, { ...form, content })
            } else {
                await createPost({ ...form, content })
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

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="absolute top-6 right-6 md:top-8 md:right-8 text-slate-400 hover:text-white transition bg-slate-800/50 hover:bg-slate-700 rounded-full w-10 h-10 flex items-center justify-center border border-white/10">
                        ✕
                    </button>

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
                            <label className="text-sm font-semibold text-slate-300 mb-2 block">
                                Title
                            </label>
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
                                    Cover Image URL
                                    <span className="text-slate-500 font-normal"> (optional)</span>
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
                                <label className="text-sm font-semibold text-slate-300 mb-2 block">
                                    Genre
                                </label>
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

                        {/* TipTap Editor */}
                        <div>
                            <label className="text-sm font-semibold text-slate-300 mb-2 block">
                                Content
                            </label>

                            {/* Toolbar */}
                            <div className="flex flex-wrap gap-1 p-2 bg-slate-800/80 border border-white/10 rounded-t-xl border-b-0">
                                <ToolbarButton
                                    onClick={() => editor.chain().focus().toggleBold().run()}
                                    active={editor?.isActive('bold')}
                                    title="Bold">
                                    <b>B</b>
                                </ToolbarButton>
                                <ToolbarButton
                                    onClick={() => editor.chain().focus().toggleItalic().run()}
                                    active={editor?.isActive('italic')}
                                    title="Italic">
                                    <i>I</i>
                                </ToolbarButton>
                                <ToolbarButton
                                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                                    active={editor?.isActive('underline')}
                                    title="Underline">
                                    <u>U</u>
                                </ToolbarButton>

                                <div className="w-px bg-white/10 mx-1" />

                                <ToolbarButton
                                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                                    active={editor?.isActive('heading', { level: 1 })}
                                    title="Heading 1">
                                    H1
                                </ToolbarButton>
                                <ToolbarButton
                                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                                    active={editor?.isActive('heading', { level: 2 })}
                                    title="Heading 2">
                                    H2
                                </ToolbarButton>
                                <ToolbarButton
                                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                                    active={editor?.isActive('heading', { level: 3 })}
                                    title="Heading 3">
                                    H3
                                </ToolbarButton>

                                <div className="w-px bg-white/10 mx-1" />

                                <ToolbarButton
                                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                                    active={editor?.isActive('bulletList')}
                                    title="Bullet List">
                                    • List
                                </ToolbarButton>
                                <ToolbarButton
                                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                                    active={editor?.isActive('orderedList')}
                                    title="Numbered List">
                                    1. List
                                </ToolbarButton>

                                <div className="w-px bg-white/10 mx-1" />

                                <ToolbarButton
                                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                                    active={editor?.isActive('blockquote')}
                                    title="Quote">
                                    ❝ Quote
                                </ToolbarButton>
                                <ToolbarButton
                                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                                    active={editor?.isActive('codeBlock')}
                                    title="Code Block">
                                    {'</>'}
                                </ToolbarButton>

                                <div className="w-px bg-white/10 mx-1" />

                                <ToolbarButton
                                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                                    active={editor?.isActive({ textAlign: 'left' })}
                                    title="Align Left">
                                    ←
                                </ToolbarButton>
                                <ToolbarButton
                                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                                    active={editor?.isActive({ textAlign: 'center' })}
                                    title="Align Center">
                                    ↔
                                </ToolbarButton>
                                <ToolbarButton
                                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                                    active={editor?.isActive({ textAlign: 'right' })}
                                    title="Align Right">
                                    →
                                </ToolbarButton>

                                <div className="w-px bg-white/10 mx-1" />

                                <ToolbarButton
                                    onClick={() => editor.chain().focus().undo().run()}
                                    title="Undo">
                                    ↩
                                </ToolbarButton>
                                <ToolbarButton
                                    onClick={() => editor.chain().focus().redo().run()}
                                    title="Redo">
                                    ↪
                                </ToolbarButton>
                            </div>

                            {/* Editor Area */}
                            <div className="glass-input rounded-t-none rounded-b-xl p-4 min-h-[300px]">
                                <EditorContent editor={editor} />
                            </div>
                        </div>

                        {/* Anonymous */}
                        <div className="flex items-center gap-3 bg-slate-800/50 p-4 rounded-xl border border-white/10 w-max">
                            <input
                                type="checkbox"
                                name="isAnonymous"
                                id="isAnonymous"
                                checked={form.isAnonymous}
                                onChange={handleChange}
                                className="w-5 h-5 rounded text-indigo-500 cursor-pointer bg-slate-700 border-white/10"
                            />
                            <label htmlFor="isAnonymous" className="text-sm font-medium text-slate-300 cursor-pointer select-none">
                                Post anonymously
                            </label>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-wrap gap-4 mt-4 pt-6 border-t border-white/10">
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

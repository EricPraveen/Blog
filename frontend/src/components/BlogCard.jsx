import { Link, useNavigate } from 'react-router-dom'
import { getGenreColor } from '../utils/genreColors'
import { useAuth } from '../context/AuthContext'
import { deletePost } from '../services/postService'

export default function BlogCard({ post, onDelete, isOwner }) {
    const { user } = useAuth()
    const navigate = useNavigate()

    const isAuthor = isOwner || (user && (
        (user.email && post.authorEmail && user.email === post.authorEmail) ||
        (user.id != null && post.authorId != null && String(user.id) === String(post.authorId))
    ))

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this post?')) return
        try {
            await deletePost(post.id)
            if (onDelete) onDelete(post.id)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="glass-card p-5 group">
            {post.coverImage && (
                <div className="overflow-hidden rounded-lg mb-4">
                    <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </div>
            )}
            <div className="flex items-center gap-2 mb-3">
                <span className={`${getGenreColor(post.genre)} border text-xs px-3 py-1 rounded-full font-medium`}>
                    {post.genre}
                </span>
                {post.isFeatured && (
                    <span className="bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
                        <span>🔥</span> Featured
                    </span>
                )}
            </div>
            <h2 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                {post.title}
            </h2>
            <p className="text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                {post.content.replace(/<[^>]+>/g, '')}
            </p>
            <div className="flex justify-between items-center">
                {post.isAnonymous ? (
            <span className="text-xs text-indigo-400 font-medium truncate pr-2">
                By Anonymous
            </span>
            ) : (
            <Link
                to={`/user/${post.authorId}`}
                className="text-xs text-indigo-400 font-medium truncate pr-2 hover:text-fuchsia-400 transition-colors">
                By {post.authorName}
            </Link>
            )}
                <div className="flex items-center gap-3">
                    {isAuthor && (
                        <button
                            onClick={() => navigate(`/write?edit=${post.id}`)}
                            className="text-xs px-2.5 py-1 rounded-md border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 transition-colors flex items-center gap-1">
                            ✏️ Edit
                        </button>
                    )}
                    <Link
                        to={`/post/${post.id}`}
                        className="text-indigo-400 text-sm font-medium hover:text-fuchsia-400 transition-colors flex items-center gap-1 whitespace-nowrap">
                        Read more <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-slate-500 text-xs font-medium">
                    <span className="text-fuchsia-500">♥</span> {post.likeCount} likes
                </span>
                {isAuthor && (
                    <button
                        onClick={handleDelete}
                        className="text-xs px-3 py-1 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors">
                        🗑 Delete
                    </button>
                )}
            </div>
        </div>
    )
}
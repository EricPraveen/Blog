import { Link } from 'react-router-dom'

export default function BlogCard({ post }) {
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
                <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs px-3 py-1 rounded-full font-medium">
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
                <span className="text-xs text-indigo-400 font-medium">
                    By {post.isAnonymous ? 'Anonymous' : post.authorName}
                </span>
                <Link
                    to={`/post/${post.id}`}
                    className="text-indigo-400 text-sm font-medium hover:text-fuchsia-400 transition-colors flex items-center gap-1">
                    Read more <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-slate-500 text-xs font-medium">
                <span className="text-fuchsia-500">♥</span> {post.likeCount} likes
            </div>
        </div>
    )
}
import { Link } from 'react-router-dom'

export default function BlogCard({ post }) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
            {post.coverImage && (
                <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                />
            )}
            <div className="flex items-center gap-2 mb-3">
                <span className="bg-orange-100 text-orange-600 text-xs px-3 py-1 rounded-full">
                    {post.genre}
                </span>
                {post.isFeatured && (
                    <span className="bg-yellow-100 text-yellow-600 text-xs px-3 py-1 rounded-full">
                        Featured
                    </span>
                )}
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {post.title}
            </h2>
            <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                {post.content.replace(/<[^>]+>/g, '')}
            </p>
            <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">
                    By {post.isAnonymous ? 'Anonymous' : post.authorName}
                </span>
                <Link
                    to={`/post/${post.id}`}
                    className="text-orange-500 text-sm hover:underline">
                    Read more →
                </Link>
            </div>
            <div className="mt-3 flex items-center gap-1 text-gray-400 text-xs">
                <span>♥ {post.likeCount} likes</span>
            </div>
        </div>
    )
}
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import BlogCard from '../components/BlogCard'
import { getUserById } from '../services/userService'
import { getPostsByUserId } from '../services/postService'
import { useAuth } from '../context/AuthContext'
import { getGenreColor } from '../utils/genreColors'

const countryFlags = {
    'Afghanistan': '🇦🇫', 'Albania': '🇦🇱', 'Algeria': '🇩🇿', 'Andorra': '🇦🇩', 'Angola': '🇦🇴',
    'Antigua and Barbuda': '🇦🇬', 'Argentina': '🇦🇷', 'Armenia': '🇦🇲', 'Australia': '🇦🇺', 'Austria': '🇦🇹',
    'Azerbaijan': '🇦🇿', 'Bahamas': '🇧🇸', 'Bahrain': '🇧🇭', 'Bangladesh': '🇧🇩', 'Barbados': '🇧🇧',
    'Belarus': '🇧🇾', 'Belgium': '🇧🇪', 'Belize': '🇧🇿', 'Benin': '🇧🇯', 'Bhutan': '🇧🇹',
    'Bolivia': '🇧🇴', 'Bosnia and Herzegovina': '🇧🇦', 'Botswana': '🇧🇼', 'Brazil': '🇧🇷', 'Brunei': '🇧🇳',
    'Bulgaria': '🇧🇬', 'Burkina Faso': '🇧🇫', 'Burundi': '🇧🇮', 'Cabo Verde': '🇨🇻', 'Cambodia': '🇰🇭',
    'Cameroon': '🇨🇲', 'Canada': '🇨🇦', 'Central African Republic': '🇨🇫', 'Chad': '🇹🇩', 'Chile': '🇨🇱',
    'China': '🇨🇳', 'Colombia': '🇨🇴', 'Comoros': '🇰🇲', 'Congo (Congo-Brazzaville)': '🇨🇬', 'Costa Rica': '🇨🇷',
    'Croatia': '🇭🇷', 'Cuba': '🇨🇺', 'Cyprus': '🇨🇾', 'Czechia': '🇨🇿', 'Democratic Republic of the Congo': '🇨🇩',
    'Denmark': '🇩🇰', 'Djibouti': '🇩🇯', 'Dominica': '🇩🇲', 'Dominican Republic': '🇩🇴', 'Ecuador': '🇪🇨',
    'Egypt': '🇪🇬', 'El Salvador': '🇸🇻', 'Equatorial Guinea': '🇬🇶', 'Eritrea': '🇪🇷', 'Estonia': '🇪🇪',
    'Eswatini': '🇸🇿', 'Ethiopia': '🇪🇹', 'Fiji': '🇫🇯', 'Finland': '🇫🇮', 'France': '🇫🇷',
    'Gabon': '🇬🇦', 'Gambia': '🇬🇲', 'Georgia': '🇬🇪', 'Germany': '🇩🇪', 'Ghana': '🇬🇭',
    'Greece': '🇬🇷', 'Grenada': '🇬🇩', 'Guatemala': '🇬🇹', 'Guinea': '🇬🇳', 'Guinea-Bissau': '🇬🇼',
    'Guyana': '🇬🇾', 'Haiti': '🇭🇹', 'Holy See': '🇻🇦', 'Honduras': '🇭🇳', 'Hungary': '🇭🇺',
    'Iceland': '🇮🇸', 'India': '🇮🇳', 'Indonesia': '🇮🇩', 'Iran': '🇮🇷', 'Iraq': '🇮🇶',
    'Ireland': '🇮🇪', 'Israel': '🇮🇱', 'Italy': '🇮🇹', 'Jamaica': '🇯🇲', 'Japan': '🇯🇵',
    'Jordan': '🇯🇴', 'Kazakhstan': '🇰🇿', 'Kenya': '🇰🇪', 'Kiribati': '🇰🇮', 'Kuwait': '🇰🇼',
    'Kyrgyzstan': '🇰🇬', 'Laos': '🇱🇦', 'Latvia': '🇱🇻', 'Lebanon': '🇱🇧', 'Lesotho': '🇱🇸',
    'Liberia': '🇱🇷', 'Libya': '🇱🇾', 'Liechtenstein': '🇱🇮', 'Lithuania': '🇱🇹', 'Luxembourg': '🇱🇺',
    'Madagascar': '🇲🇬', 'Malawi': '🇲🇼', 'Malaysia': '🇲🇾', 'Maldives': '🇲🇻', 'Mali': '🇲🇱',
    'Malta': '🇲🇹', 'Marshall Islands': '🇲🇭', 'Mauritania': '🇲🇷', 'Mauritius': '🇲🇺', 'Mexico': '🇲🇽',
    'Micronesia': '🇫🇲', 'Moldova': '🇲🇩', 'Monaco': '🇲🇨', 'Mongolia': '🇲🇳', 'Montenegro': '🇲🇪',
    'Morocco': '🇲🇦', 'Mozambique': '🇲🇿', 'Myanmar': '🇲🇲', 'Namibia': '🇳🇦', 'Nauru': '🇳🇷',
    'Nepal': '🇳🇵', 'Netherlands': '🇳🇱', 'New Zealand': '🇳🇿', 'Nicaragua': '🇳🇮', 'Niger': '🇳🇪',
    'Nigeria': '🇳🇬', 'North Korea': '🇰🇵', 'North Macedonia': '🇲🇰', 'Norway': '🇳🇴', 'Oman': '🇴🇲',
    'Pakistan': '🇵🇰', 'Palau': '🇵🇼', 'Palestine State': '🇵🇸', 'Panama': '🇵🇦', 'Papua New Guinea': '🇵🇬',
    'Paraguay': '🇵🇾', 'Peru': '🇵🇪', 'Philippines': '🇵🇭', 'Poland': '🇵🇱', 'Portugal': '🇵🇹',
    'Qatar': '🇶🇦', 'Romania': '🇷🇴', 'Russia': '🇷🇺', 'Rwanda': '🇷🇼', 'Saint Kitts and Nevis': '🇰🇳',
    'Saint Lucia': '🇱🇨', 'Saint Vincent and the Grenadines': '🇻🇨', 'Samoa': '🇼🇸', 'San Marino': '🇸🇲',
    'Sao Tome and Principe': '🇸🇹', 'Saudi Arabia': '🇸🇦', 'Senegal': '🇸🇳', 'Serbia': '🇷🇸',
    'Seychelles': '🇸🇨', 'Sierra Leone': '🇸🇱', 'Singapore': '🇸🇬', 'Slovakia': '🇸🇰', 'Slovenia': '🇸🇮',
    'Solomon Islands': '🇸🇧', 'Somalia': '🇸🇴', 'South Africa': '🇿🇦', 'South Korea': '🇰🇷',
    'South Sudan': '🇸🇸', 'Spain': '🇪🇸', 'Sri Lanka': '🇱🇰', 'Sudan': '🇸🇩', 'Suriname': '🇸🇷',
    'Sweden': '🇸🇪', 'Switzerland': '🇨🇭', 'Syria': '🇸🇾', 'Tajikistan': '🇹🇯', 'Tanzania': '🇹🇿',
    'Thailand': '🇹🇭', 'Timor-Leste': '🇹🇱', 'Togo': '🇹🇬', 'Tonga': '🇹🇴', 'Trinidad and Tobago': '🇹🇹',
    'Tunisia': '🇹🇳', 'Turkey': '🇹🇷', 'Turkmenistan': '🇹🇲', 'Tuvalu': '🇹🇻', 'Uganda': '🇺🇬',
    'Ukraine': '🇺🇦', 'United Arab Emirates': '🇦🇪', 'United Kingdom': '🇬🇧', 'United States': '🇺🇸',
    'Uruguay': '🇺🇾', 'Uzbekistan': '🇺🇿', 'Vanuatu': '🇻🇺', 'Venezuela': '🇻🇪', 'Vietnam': '🇻🇳',
    'Yemen': '🇾🇪', 'Zambia': '🇿🇲', 'Zimbabwe': '🇿🇼',
}

const genres = ['All', 'Technology', 'Travel', 'Food', 'Lifestyle', 'Fiction', 'Opinion', 'Health', 'Finance', 'Gaming', 'Culture', 'Else']

export default function UserProfile() {
    const { id } = useParams()
    const { user: currentUser } = useAuth()
    const navigate = useNavigate()
    const [profileUser, setProfileUser] = useState(null)
    const [posts, setPosts] = useState([])
    const [filteredPosts, setFilteredPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [postsLoading, setPostsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedGenre, setSelectedGenre] = useState('All')

    useEffect(() => {
        loadUser()
        loadPosts()
    }, [id])

    useEffect(() => {
        filterPosts()
    }, [posts, searchQuery, selectedGenre])

    const loadUser = async () => {
        try {
            const data = await getUserById(id)
            setProfileUser(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const loadPosts = async () => {
        try {
            const data = await getPostsByUserId(id)
            setPosts(data)
            setFilteredPosts(data)
        } catch (err) {
            console.error(err)
        } finally {
            setPostsLoading(false)
        }
    }

    const filterPosts = () => {
        let result = [...posts]

        if (selectedGenre !== 'All') {
            result = result.filter(p => p.genre === selectedGenre)
        }

        if (searchQuery.trim()) {
            result = result.filter(p =>
                p.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        setFilteredPosts(result)
    }

    const handleSearch = (e) => {
        e.preventDefault()
        filterPosts()
    }

    const handleClearFilters = () => {
        setSearchQuery('')
        setSelectedGenre('All')
        setFilteredPosts(posts)
    }

    const getJoinedDate = (dateStr) => {
        if (!dateStr) return 'Unknown'
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        })
    }

    const isOwnProfile = currentUser && String(currentUser.id) === String(id)
    const isFiltered = searchQuery.trim() || selectedGenre !== 'All'
    const availableGenres = genres

    if (loading) return (
        <div className="flex-1 w-full">
            <Navbar />
            <div className="flex flex-col items-center justify-center py-20 opacity-70">
                <div className="w-10 h-10 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-indigo-400 font-medium animate-pulse">
                    Loading profile...
                </p>
            </div>
        </div>
    )

    if (!profileUser) return (
        <div className="flex-1 w-full">
            <Navbar />
            <div className="glass-card text-center py-20 mx-auto max-w-3xl mt-12 flex flex-col items-center">
                <span className="text-6xl mb-4 opacity-50">👤</span>
                <h3 className="text-xl font-bold text-white mb-2">
                    User not found
                </h3>
                <button
                    onClick={() => navigate('/')}
                    className="mt-4 btn-gradient px-6 py-2">
                    Go Home
                </button>
            </div>
        </div>
    )

    return (
        <div className="flex-1 w-full">
            <Navbar />
            <div className="max-w-5xl mx-auto px-6 py-10 animate-fade-in">

                {/* Profile Header Card */}
                <div className="glass p-8 rounded-3xl mb-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 opacity-90"></div>

                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">

                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-full bg-indigo-500/20 border-2 border-indigo-500/30 flex items-center justify-center text-4xl font-bold text-indigo-400 shrink-0">
                            {profileUser.name?.charAt(0).toUpperCase()}
                        </div>

                        {/* Info - Restructured for consistency */}
                        <div className="flex-1">
                            {/* Name and Badge */}
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                                    {profileUser.name}
                                </h1>
                                {isOwnProfile && (
                                    <span className="text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-full">
                                        You
                                    </span>
                                )}
                            </div>

                            {/* Username */}
                            <p className="text-indigo-400 font-medium mb-3">
                                @{profileUser.username || 'anonymous'}
                            </p>

                            {/* Bio */}
                            <p className="text-slate-300 text-sm leading-relaxed mb-4 max-w-xl min-h-[3rem]">
                                {profileUser.bio || <span className="text-slate-500 italic">No bio added yet</span>}
                            </p>

                            {/* Stats Grid - Always Displayed */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                                {profileUser.country && (
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-500 font-medium mb-1">Location</span>
                                        <span className="text-sm text-slate-300">
                                            {profileUser.country}
                                        </span>
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-500 font-medium mb-1">Joined</span>
                                    <span className="text-sm text-slate-300">
                                        {getJoinedDate(profileUser.createdAt)}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-500 font-medium mb-1">Posts</span>
                                    <span className="text-sm text-slate-300">
                                        {posts.length} {posts.length === 1 ? 'post' : 'posts'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 shrink-0">
                            {isOwnProfile && (
                                <button
                                    onClick={() => navigate('/edit-profile')}
                                    className="text-sm px-5 py-2 rounded-full border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 transition-colors">
                                    ✏️ Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Posts Section */}
                <div>
                    <div className="flex items-center gap-2 mb-6">
                        <span className="text-2xl">✍️</span>
                        <h2 className="text-2xl font-bold text-white">
                            {isOwnProfile ? 'My Posts' : `Posts by ${profileUser.name}`}
                        </h2>
                    </div>

                    {/* Search and Filter */}
                    {!postsLoading && posts.length > 0 && (
                        <div className="glass p-4 rounded-2xl mb-6 flex flex-col gap-4">

                            {/* Search Bar */}
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search posts by title..."
                                    className="flex-1 glass-input py-2.5 text-sm"
                                />
                                <button
                                    type="submit"
                                    className="btn-gradient px-5 py-2.5 text-sm">
                                    🔍 Search
                                </button>
                                {isFiltered && (
                                    <button
                                        type="button"
                                        onClick={handleClearFilters}
                                        className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-colors text-sm">
                                        ✕ Clear
                                    </button>
                                )}
                            </form>

                            {/* Genre Filter */}
                            <div className="flex flex-wrap gap-2">
                                {availableGenres.map(genre => (
                                    <button
                                        key={genre}
                                        onClick={() => setSelectedGenre(genre)}
                                        className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium
                                            ${selectedGenre === genre
                                                ? 'bg-indigo-500/30 text-indigo-300 border-indigo-500/50'
                                                : `${genre !== 'All' ? getGenreColor(genre) : 'text-slate-400 border-white/10'} hover:border-white/20`
                                            }`}>
                                        {genre}
                                    </button>
                                ))}
                            </div>

                            {/* Filter Results Count */}
                            {isFiltered && (
                                <p className="text-xs text-slate-400">
                                    Showing {filteredPosts.length} of {posts.length} posts
                                    {searchQuery && ` for "${searchQuery}"`}
                                    {selectedGenre !== 'All' && ` in ${selectedGenre}`}
                                </p>
                            )}
                        </div>
                    )}

                    {postsLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 opacity-70">
                            <div className="w-10 h-10 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-indigo-400 font-medium animate-pulse">
                                Loading posts...
                            </p>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="glass-card text-center py-20 flex flex-col items-center">
                            <span className="text-6xl mb-4 opacity-50">📭</span>
                            <h3 className="text-xl font-bold text-slate-200 mb-2">
                                No posts yet
                            </h3>
                            <p className="text-slate-400">
                                {isOwnProfile
                                    ? 'You have not published any posts yet'
                                    : `${profileUser.name} has not published any posts yet`}
                            </p>
                            {isOwnProfile && (
                                <button
                                    onClick={() => navigate('/write')}
                                    className="mt-6 btn-gradient px-6 py-2">
                                    Write your first post
                                </button>
                            )}
                        </div>
                    ) : filteredPosts.length === 0 ? (
                        <div className="glass-card text-center py-20 flex flex-col items-center">
                            <span className="text-6xl mb-4 opacity-50">🔍</span>
                            <h3 className="text-xl font-bold text-slate-200 mb-2">
                                No posts found
                            </h3>
                            <p className="text-slate-400 mb-4">
                                Try adjusting your search or filter
                            </p>
                            <button
                                onClick={handleClearFilters}
                                className="btn-gradient px-6 py-2 text-sm">
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredPosts.map(post => (
                                <BlogCard
                                    key={post.id}
                                    post={post}
                                    onDelete={(deletedId) => {
                                        setPosts(posts.filter(p => String(p.id) !== String(deletedId)))
                                        setFilteredPosts(filteredPosts.filter(p => String(p.id) !== String(deletedId)))
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
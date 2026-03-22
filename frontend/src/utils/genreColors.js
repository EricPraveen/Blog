export const genreColors = {
    'Technology': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'Travel': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    'Food': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    'Lifestyle': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    'Fiction': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    'Opinion': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    'Health': 'bg-red-500/20 text-red-300 border-red-500/30',
    'Finance': 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    'Gaming': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    'Culture': 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    'Else': 'bg-green-500/20 text-green-300 border-green-500/30',
    'default': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
}

export const getGenreColor = (genre) => {
    return genreColors[genre] || genreColors['default']
}

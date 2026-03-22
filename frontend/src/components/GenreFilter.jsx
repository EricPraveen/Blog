const genres = [
    'All', 'Technology', 'Travel', 'Food',
    'Lifestyle', 'Fiction', 'Opinion',
    'Health', 'Finance', 'Gaming', 'Culture', 'Else'
]

export default function GenreFilter({ selected, onSelect }) {
    return (
        <div className="flex gap-2 flex-wrap mb-6">
            {genres.map(genre => (
                <button
                    key={genre}
                    onClick={() => onSelect(genre)}
                    className={`px-5 py-2 rounded-full text-sm font-medium backdrop-blur-sm transition-all duration-300
                        ${selected === genre
                            ? 'bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white shadow-md shadow-indigo-500/20 border-transparent'
                            : 'bg-slate-800/50 text-slate-300 border border-white/10 hover:bg-slate-700/80 hover:border-indigo-400/50 hover:text-white hover:shadow-sm'
                        }`}>
                    {genre}
                </button>
            ))}
        </div>
    )
}
const genres = [
    'All', 'Technology', 'Travel', 'Food',
    'Lifestyle', 'Fiction', 'Opinion',
    'Health', 'Finance', 'Gaming', 'Culture'
]

export default function GenreFilter({ selected, onSelect }) {
    return (
        <div className="flex gap-2 flex-wrap mb-6">
            {genres.map(genre => (
                <button
                    key={genre}
                    onClick={() => onSelect(genre)}
                    className={`px-4 py-2 rounded-full text-sm border transition
                        ${selected === genre
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-orange-400'
                        }`}>
                    {genre}
                </button>
            ))}
        </div>
    )
}
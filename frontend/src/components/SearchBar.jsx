import { useState } from 'react'

export default function SearchBar({ onSearch }) {
    const [query, setQuery] = useState('')

    const handleSearch = (e) => {
        e.preventDefault()
        onSearch(query)
    }

    return (
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search posts..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-orange-400"
            />
            <button
                type="submit"
                className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600">
                Search
            </button>
        </form>
    )
}
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
                className="flex-1 glass-input focus:ring-fuchsia-400 placeholder:text-slate-500"
            />
            <button
                type="submit"
                className="btn-gradient px-6 py-2">
                Search
            </button>
        </form>
    )
}
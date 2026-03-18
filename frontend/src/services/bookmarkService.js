import axios from 'axios'

const API = 'http://localhost:8080/api/bookmarks'

const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})

export const getBookmarks = async () => {
    const response = await axios.get(API, authHeader())
    return response.data
}

export const toggleBookmark = async (postId) => {
    const response = await axios.post(`${API}/${postId}`, {}, authHeader())
    return response.data
}
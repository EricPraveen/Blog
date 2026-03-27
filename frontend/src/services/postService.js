import axios from 'axios'

const API = 'http://localhost:8080/api/posts'

const getToken = () => {
    const token = localStorage.getItem('token')
    if (!token) {
        console.warn('No token found in localStorage')
    }
    return token
}

const authHeader = () => {
    const token = getToken()
    if (!token) {
        throw new Error('No authentication token available. Please login first.')
    }
    return {
        headers: { 
            Authorization: `Bearer ${token}`
        }
    }
}

export const getAllPosts = async () => {
    const response = await axios.get(API)
    return response.data
}

export const getPostById = async (id) => {
    const response = await axios.get(`${API}/${id}`)
    return response.data
}

export const getPostsByGenre = async (genre) => {
    const response = await axios.get(`${API}/genre/${genre}`)
    return response.data
}

export const searchPosts = async (query) => {
    const response = await axios.get(`${API}/search?q=${query}`)
    return response.data
}

export const getRandomPost = async () => {
    const response = await axios.get(`${API}/random`)
    return response.data
}

export const getFeaturedPosts = async () => {
    const response = await axios.get(`${API}/featured`)
    return response.data
}

export const getPostsByUserId = async (userId) => {
    const response = await axios.get(
        `http://localhost:8080/api/users/${userId}/posts`
    )
    return response.data
}

export const createPost = async (data) => {
    const response = await axios.post(API, data, authHeader())
    return response.data
}

export const updatePost = async (id, data) => {
    const response = await axios.put(`${API}/${id}`, data, authHeader())
    return response.data
}

export const deletePost = async (id) => {
    const response = await axios.delete(`${API}/${id}`, authHeader())
    return response.data
}

export const getDrafts = async () => {
    const response = await axios.get(`${API}/drafts`, authHeader())
    return response.data
}

export const publishPost = async (id, currentData) => {
    const response = await axios.put(
        `${API}/${id}`,
        { ...currentData, status: 'published' },
        authHeader()
    )
    return response.data
}
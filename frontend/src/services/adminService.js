import axios from 'axios'

const API = 'http://localhost:8080/api/admin'

const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})

export const getPendingPosts = async () => {
    const response = await axios.get(`${API}/posts/pending`, authHeader())
    return response.data
}

export const approvePost = async (id) => {
    const response = await axios.put(`${API}/posts/${id}/approve`, {}, authHeader())
    return response.data
}

export const featurePost = async (id) => {
    const response = await axios.put(`${API}/posts/${id}/feature`, {}, authHeader())
    return response.data
}

export const getPendingReports = async () => {
    const response = await axios.get(`${API}/reports`, authHeader())
    return response.data
}

export const resolveReport = async (id) => {
    const response = await axios.put(`${API}/reports/${id}/resolve`, {}, authHeader())
    return response.data
}
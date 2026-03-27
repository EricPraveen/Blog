import axios from 'axios'

const API = 'http://localhost:8080/api/users'

const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})

export const updateProfile = async (data) => {
    const response = await axios.put(`${API}/profile`, data, authHeader())
    return response.data
}

export const changePassword = async (data) => {
    const response = await axios.put(`${API}/password`, data, authHeader())
    return response.data
}

export const getUserById = async (id) => {
    const response = await axios.get(`${API}/${id}`)
    return response.data
}

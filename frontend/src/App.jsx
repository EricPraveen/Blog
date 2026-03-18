import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import PostDetail from './pages/PostDetail'
import WritePost from './pages/WritePost'
import Profile from './pages/Profile'
import Bookmarks from './pages/Bookmarks'
import AdminDashboard from './pages/AdminDashboard'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/post/:id" element={<PostDetail />} />
                <Route path="/write" element={<WritePost />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/bookmarks" element={<Bookmarks />} />
                <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
        </Router>
    )
}

export default App

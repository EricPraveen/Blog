import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import {
    getPendingPosts,
    approvePost,
    featurePost,
    getPendingReports,
    resolveReport
} from '../services/adminService'

export default function AdminDashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [pendingPosts, setPendingPosts] = useState([])
    const [reports, setReports] = useState([])
    const [activeTab, setActiveTab] = useState('posts')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user || user.role !== 'admin') navigate('/')
        else loadData()
    }, [])

    const loadData = async () => {
        try {
            const [posts, reps] = await Promise.all([
                getPendingPosts(),
                getPendingReports()
            ])
            setPendingPosts(posts)
            setReports(reps)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleApprove = async (id) => {
        try {
            await approvePost(id)
            setPendingPosts(pendingPosts.filter(p => p.id !== id))
        } catch (err) {
            console.error(err)
        }
    }

    const handleFeature = async (id) => {
        try {
            await featurePost(id)
            alert('Post featured status toggled!')
        } catch (err) {
            console.error(err)
        }
    }

    const handleResolve = async (id) => {
        try {
            await resolveReport(id)
            setReports(reports.filter(r => r.id !== id))
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="flex-1 w-full">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 py-10 animate-fade-in">
                <div className="flex items-center gap-3 mb-8">
                    <span className="text-3xl">🛡️</span>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">
                        Admin Dashboard
                    </h1>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('posts')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 shadow-sm ${activeTab === 'posts' ? 'btn-gradient' : 'btn-glass'}`}>
                        Pending Posts ({pendingPosts.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('reports')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 shadow-sm ${activeTab === 'reports' ? 'btn-gradient' : 'btn-glass'}`}>
                        Reports ({reports.length})
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-70">
                        <div className="w-10 h-10 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-indigo-600 font-medium animate-pulse">
                            Loading dashboard...
                        </p>
                    </div>
                ) : activeTab === 'posts' ? (
                    <div className="flex flex-col gap-6">
                        {pendingPosts.length === 0 ? (
                            <div className="glass-card p-12 text-center flex flex-col items-center">
                                <span className="text-5xl mb-4 opacity-70">✨</span>
                                <h3 className="text-xl font-bold text-slate-200">All caught up!</h3>
                                <p className="text-slate-400 mt-2">No pending posts to review.</p>
                            </div>
                        ) : (
                            pendingPosts.map(post => (
                                <div key={post.id} className="glass-card p-6 group">
                                    <div className="flex justify-between items-start gap-4 mb-4">
                                        <div>
                                            <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs px-3 py-1 rounded-full font-medium inline-block mb-3">
                                                {post.genre}
                                            </span>
                                            <h2 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                                                {post.title}
                                            </h2>
                                        </div>
                                    </div>
                                    <p className="text-slate-300 text-sm mb-6 line-clamp-2 leading-relaxed">
                                        {post.content?.replace(/<[^>]+>/g, '')}
                                    </p>
                                    <div className="flex gap-4 border-t border-white/10 pt-5">
                                        <button
                                            onClick={() => handleApprove(post.id)}
                                            className="px-5 py-2 rounded-lg text-sm font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/40 hover:text-white transition-all shadow-sm">
                                            ✅ Approve
                                        </button>
                                        <button
                                            onClick={() => handleFeature(post.id)}
                                            className="px-5 py-2 rounded-lg text-sm font-medium bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30 hover:bg-fuchsia-500/40 hover:text-white transition-all shadow-sm">
                                            🔥 Feature
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {reports.length === 0 ? (
                            <div className="glass-card p-12 text-center flex flex-col items-center">
                                <span className="text-5xl mb-4 opacity-70">✨</span>
                                <h3 className="text-xl font-bold text-slate-200">All clear!</h3>
                                <p className="text-slate-400 mt-2">No pending reports to resolve.</p>
                            </div>
                        ) : (
                            reports.map(report => (
                                <div key={report.id} className="glass-card p-6">
                                    <div className="bg-red-950/30 border border-red-500/20 rounded-lg p-4 mb-5">
                                        <h3 className="text-red-400 font-semibold mb-1">Reported Issue</h3>
                                        <p className="text-sm text-red-300">
                                            {report.reason}
                                        </p>
                                    </div>
                                    <p className="text-sm text-slate-400 mb-5 font-medium">
                                        Reference Post ID: <span className="text-slate-200 bg-slate-700 px-2 py-1 rounded">{report.post?.id}</span>
                                    </p>
                                    <button
                                        onClick={() => handleResolve(report.id)}
                                        className="btn-gradient w-full md:w-auto px-6">
                                        Mark as Resolved
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
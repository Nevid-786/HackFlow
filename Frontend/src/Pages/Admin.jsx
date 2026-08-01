import { User, Check, X, Users2, Clock, Mail } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import userService from '../api/userService' // adjust path if different
console.log(userService)
const tabs = [
    { key: 'pending', label: 'Pending requests' },
    { key: 'members', label: 'All members' },
]

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('pending')

    const [pending, setPending] = useState([])
    const [members, setMembers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [actingOnId, setActingOnId] = useState(null) // disables buttons on the row being approved/rejected

    const loadData = async () => {
        setLoading(true)
        setError(null)
        try {
            const [pendingUsers, allMembers] = await Promise.all([
                userService.getPendingUsers(),
                userService.getAllMembers(),
            ])
            setPending(pendingUsers)
            setMembers(allMembers)
        } catch (err) {
            setError(err.errors?.join(', ') || err.message || 'Failed to load users')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const handleApprove = async (id) => {
        setActingOnId(id)
        try {
            await userService.approveUser(id)
            // move it locally instead of a full refetch
            const approvedUser = pending.find((u) => u._id === id)
            setPending((prev) => prev.filter((u) => u._id !== id))
            if (approvedUser) setMembers((prev) => [...prev, { ...approvedUser, status: 'approved' }])
        } catch (err) {
            setError(err.errors?.join(', ') || err.message || 'Failed to approve user')
        } finally {
            setActingOnId(null)
        }
    }

    const handleReject = async (id) => {
        setActingOnId(id)
        try {
            await userService.rejectUser(id)
            setPending((prev) => prev.filter((u) => u._id !== id))
        } catch (err) {
            setError(err.errors?.join(', ') || err.message || 'Failed to reject user')
        } finally {
            setActingOnId(null)
        }
    }

    return (
        <div className="w-full h-full flex flex-col items-center gap-y-4 py-4 overflow-y-auto">

            {/* header */}
            <div className="flex justify-between items-center px-8 py-4 border-gray-300 border-2 w-[90%] rounded-md">
                <div>
                    <h1 className="font-bold text-lg">Admin</h1>
                    <p className="text-xs text-gray-400 font-jetbrains">Manage signup requests and members</p>
                </div>

                <div className="flex items-center gap-x-1 bg-gray-100 rounded-md p-1">
                    {tabs.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setActiveTab(t.key)}
                            className={`flex items-center gap-x-1.5 text-sm font-jetbrains px-4 py-1.5 rounded-md transition-colors ${
                                activeTab === t.key
                                    ? 'bg-white text-primary shadow-sm font-bold'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {t.key === 'pending' ? <Clock size={14} /> : <Users2 size={14} />}
                            {t.label}
                            <span className="text-xs opacity-70">
                                ({t.key === 'pending' ? pending.length : members.length})
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {loading && <p className="text-sm text-gray-400 font-jetbrains">Loading…</p>}
            {!loading && error && <p className="text-sm text-red-500 font-jetbrains">{error}</p>}

            {/* pending requests */}
            {!loading && activeTab === 'pending' && (
                <div className="flex flex-col w-[90%] gap-y-3">
                    {pending.length === 0 ? (
                        <div className="flex flex-col items-center gap-y-2 border-2 border-dashed border-gray-300 rounded-md py-10">
                            <Clock className="text-gray-300" size={22} />
                            <p className="text-sm text-gray-400">No pending signup requests.</p>
                        </div>
                    ) : (
                        pending.map((u) => (
                            <div key={u._id} className="flex items-center justify-between border-2 border-gray-300 rounded-md px-5 py-3">
                                <div className="flex items-center gap-x-3">
                                    <div className="rounded-full w-10 h-10 border-2 border-gray-300 flex justify-center items-center overflow-hidden shrink-0">
                                        {u.profilePicture ? (
                                            <img src={u.profilePicture} alt={u.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={16} className="text-gray-400" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm">{u.name}</div>
                                        <div className="flex items-center gap-x-1 text-xs text-gray-400 font-jetbrains">
                                            <Mail size={11} />
                                            {u.email}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-x-2">
                                    <button
                                        onClick={() => handleReject(u._id)}
                                        disabled={actingOnId === u._id}
                                        className="flex items-center gap-x-1 border-2 border-gray-300 text-gray-500 hover:border-red-400 hover:text-red-500 px-3 py-1.5 rounded-md text-xs font-medium disabled:opacity-50 transition-colors"
                                    >
                                        <X size={14} /> Reject
                                    </button>
                                    <button
                                        onClick={() => handleApprove(u._id)}
                                        disabled={actingOnId === u._id}
                                        className="flex items-center gap-x-1 bg-primary text-white px-3 py-1.5 rounded-md text-xs font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
                                    >
                                        <Check size={14} /> {actingOnId === u._id ? 'Approving…' : 'Approve'}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* all members */}
            {!loading && activeTab === 'members' && (
                <div className="grid gap-4 w-[90%] grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
                    {members.map((u) => (
                        <div key={u._id} className="flex items-center gap-x-3 border-2 border-gray-300 rounded-md px-4 py-3">
                            <div className="rounded-full w-10 h-10 border-2 border-gray-300 flex justify-center items-center overflow-hidden shrink-0">
                                {u.profilePicture ? (
                                    <img src={u.profilePicture} alt={u.name} className="w-full h-full object-cover" />
                                ) : (
                                    <User size={16} className="text-gray-400" />
                                )}
                            </div>
                            <div className="min-w-0">
                                <div className="font-bold text-sm truncate">{u.name}</div>
                                <div className="text-xs text-gray-400 font-jetbrains truncate">{u.email}</div>
                            </div>
                            {u.role === 'admin' && (
                                <span className="ml-auto text-[0.6rem] font-jetbrains font-bold uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-md shrink-0">
                                    Admin
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default AdminPage
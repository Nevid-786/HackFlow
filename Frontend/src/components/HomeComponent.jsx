import {
    Share2,
    User,
    MapPin,
    Users,
    Trophy,
    Calendar,
    Code2 as Github,
    Link2 as Linkedin,
    Sparkles,
    Check,
    X,
    Users2,
    Clock,
    Mail,
} from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { axiosPrivate } from '../hooks/axiosPrivate'
import userService from '../api/userService'

const statusStyles = {
    Upcoming: 'bg-yellow-400/20 text-yellow-600',
    Ongoing: 'bg-green-400/20 text-green-600',
    Completed: 'bg-gray-400/20 text-gray-500',
}

const filters = [
    { key: 'all', label: 'All' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'ongoing', label: 'Ongoing' },
    { key: 'past', label: 'Participated' },
]

// tabs for the admin-only section (pending signup requests / all members)
const adminTabs = [
    { key: 'pending', label: 'Pending requests' },
    { key: 'members', label: 'All members' },
]

const formatDateRange = (start, end) => {
    const opts = { month: 'short', day: 'numeric' }
    const s = new Date(start).toLocaleDateString('en-US', opts)
    const e = new Date(end).toLocaleDateString('en-US', opts)
    return `${s} — ${e}`
}

const formatCurrency = (amount) => {
    if (!amount) return null
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount)
}

// derive the bucket from actual dates rather than trusting a possibly-stale status field
const getTemporalStatus = (hackathon) => {
    const now = new Date()
    const start = new Date(hackathon.startDate)
    const end = new Date(hackathon.endDate)
    if (now < start) return 'upcoming'
    if (now > end) return 'past'
    return 'ongoing'
}

const HomeComponent = () => {
    const user = useSelector((state) => state.auth.user)
    const navigate = useNavigate()
    const isAdmin = user?.role === 'admin'

    const [entries, setEntries] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activeFilter, setActiveFilter] = useState('past')

    // ---------- Admin-only state (moved over from AdminPage) ----------
    const [activeAdminTab, setActiveAdminTab] = useState('pending')
    const [pending, setPending] = useState([])
    const [members, setMembers] = useState([])
    const [adminLoading, setAdminLoading] = useState(true)
    const [adminError, setAdminError] = useState(null)
    const [actingOnId, setActingOnId] = useState(null) // disables buttons on the row being approved/rejected

    useEffect(() => {
        console.log("User in HomeComponent:", user) // Debugging line to check the user state
        let isMounted = true
        const controller = new AbortController()

        const fetchMyHackathons = async () => {
            try {
                setLoading(true)
                const res = await axiosPrivate.get('/me/hackathons', {
                    signal: controller.signal,
                })
                if (isMounted) {
                    setEntries(res.data?.data ?? [])
                    setError(null)
                }
            } catch (err) {
                if (isMounted) setError("Couldn't load your hackathons. Try again.")
            } finally {
                if (isMounted) setLoading(false)
            }
        }

        fetchMyHackathons()
        return () => {
            isMounted = false
            controller.abort()
        }
    }, [])

    // ---------- Load admin data only once we know the user is an admin ----------
    const loadAdminData = async () => {
        setAdminLoading(true)
        setAdminError(null)
        try {
            const [pendingUsers, allMembers] = await Promise.all([
                userService.getPendingUsers(),
                userService.getAllMembers(),
            ])
            setPending(pendingUsers)
            setMembers(allMembers)
        } catch (err) {
            setAdminError(err.errors?.join(', ') || err.message || 'Failed to load users')
        } finally {
            setAdminLoading(false)
        }
    }

    useEffect(() => {
        if (isAdmin) {
            loadAdminData()
        }
    }, [isAdmin])

    const handleApprove = async (id) => {
        setActingOnId(id)
        try {
            await userService.approveUser(id)
            // move it locally instead of a full refetch
            const approvedUser = pending.find((u) => u._id === id)
            setPending((prev) => prev.filter((u) => u._id !== id))
            if (approvedUser) setMembers((prev) => [...prev, { ...approvedUser, status: 'approved' }])
        } catch (err) {
            setAdminError(err.errors?.join(', ') || err.message || 'Failed to approve user')
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
            setAdminError(err.errors?.join(', ') || err.message || 'Failed to reject user')
        } finally {
            setActingOnId(null)
        }
    }

    function handleLogout() {
        userService.logout()
        navigate("/login")
    }

    const counts = useMemo(() => {
        const c = { all: entries.length, upcoming: 0, ongoing: 0, past: 0 }
        entries.forEach(({ hackathon }) => {
            c[getTemporalStatus(hackathon)] += 1
        })
        return c
    }, [entries])

    const visibleEntries = useMemo(() => {
        if (activeFilter === 'all') return entries
        return entries.filter(({ hackathon }) => getTemporalStatus(hackathon) === activeFilter)
    }, [entries, activeFilter])

    const handleShareProfile = () => {
        const url = `${window.location.origin}/profile/${user?._id}`
        navigator.clipboard?.writeText(url)
    }

    return (
        <div className='w-full h-full border-5 flex flex-col items-center gap-y-4 py-4 overflow-y-auto'>

            {/* Profile part */}
            {user ? (
            <div className="relative w-[94%] sm:w-[90%] rounded-md border-2 border-gray-300">
                {/* gradient banner — rounds its own top corners so we don't need overflow-hidden on the parent */}
                <div className="h-16 w-full bg-gradient-to-r from-primary via-[#57DFFE] to-primary rounded-t-[4px]" />

                <div className="flex flex-wrap justify-between items-end gap-y-4 px-4 sm:px-8 pb-5 -mt-8">
                    <div className="Profile flex items-end gap-x-3 sm:gap-x-4">
                        <div className="ProfilePic rounded-full w-16 h-16 sm:w-20 sm:h-20 border-4 border-white bg-white flex justify-center items-center overflow-hidden shadow-md shrink-0">
                            {user?.profilePicture ? (
                                <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <User className="text-gray-400" size={28} />
                            )}
                        </div>

                        {/* Name */}
                        <div className="flex flex-col items-start pb-1">
                            <div className="flex items-center gap-x-2">
                                <div className="Name font-bold text-lg">{user?.name}</div>
                                {user?.role === 'admin' && (
                                    <span className="flex items-center gap-x-1 bg-primary/10 text-primary text-[0.65rem] font-jetbrains font-bold uppercase px-2 py-0.5 rounded-md">
                                        <Sparkles size={10} /> Admin
                                    </span>
                                )}
                            </div>
                            <div className="text-xs text-gray-400 font-jetbrains mb-1.5">{user?.email}</div>

                            <div className="flex items-center gap-x-3">
                               

                                {(user?.github || user?.linkedin) && (
                                    <div className="flex items-center gap-x-2 border-l border-gray-200 pl-3">
                                        {user?.github && (
                                            <div className="flex gap-x-1 font-jetbrains  justify-center items-center">
                                                Git<a href={user.github} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-primary">
                                              <Github size={16} />
                                            </a>
                                            </div>
                                        )}
                                        {user?.linkedin && (
                                             <div className="flex gap-x-1 font-jetbrains  justify-center items-center">
                                                Linkedin <a href={user.linkedin} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-primary">
                                                <Linkedin size={16} />
                                            </a>
                                            
                                            </div>
                                           
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-x-5">
                        {/* quick stats */}
                        <div className="hidden sm:flex items-center gap-x-4 pr-4 border-r border-gray-200">
                            <div className="flex flex-col items-center">
                                <span className="font-bold text-sm">{counts.all}</span>
                                <span className="text-[0.65rem] text-gray-400 font-jetbrains uppercase">Total</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="font-bold text-sm text-yellow-600">{counts.upcoming}</span>
                                <span className="text-[0.65rem] text-gray-400 font-jetbrains uppercase">Upcoming</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="font-bold text-sm text-gray-500">{counts.past}</span>
                                <span className="text-[0.65rem] text-gray-400 font-jetbrains uppercase">Past</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-x-2 gap-y-2 items-center">
                            <button onClick={handleLogout} className='flex p-3  text-sm bg-primary  items-center justify-center w-20 h-9 border-2 border-gray-300 rounded-md text-black hover:border-primary '>
                               <span> Log Out</span>
                            </button>
                            <button onClick={() => navigate(`/profile/${user?._id}`)} className='bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity'>Info</button>
                        </div>
                    </div>
                </div>
            </div>
            ) : (
                <div className="w-[94%] sm:w-[90%] rounded-md overflow-hidden border-2 border-gray-300 animate-pulse">
                    <div className="h-16 w-full bg-gray-200" />
                    <div className="flex items-end gap-x-4 px-8 pb-5 -mt-8">
                        <div className="w-20 h-20 rounded-full border-4 border-white bg-gray-300 shrink-0" />
                        <div className="flex flex-col gap-y-2 pb-1">
                            <div className="h-4 w-32 bg-gray-200 rounded" />
                            <div className="h-3 w-44 bg-gray-200 rounded" />
                        </div>
                    </div>
                </div>
            )}

            {/* ================= Admin section (only rendered for admins) ================= */}
            {isAdmin && (
                <div className="flex flex-col w-[94%] sm:w-[90%] gap-y-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-y-3 px-4 sm:px-8 py-4 border-gray-300 border-2 rounded-md">
                        <div>
                            <h1 className="font-bold text-lg">Admin</h1>
                            <p className="text-xs text-gray-400 font-jetbrains">Manage signup requests and members</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-1 gap-y-1 bg-gray-100 rounded-md p-1">
                            {adminTabs.map((t) => (
                                <button
                                    key={t.key}
                                    onClick={() => setActiveAdminTab(t.key)}
                                    className={`flex items-center gap-x-1.5 text-sm font-jetbrains px-4 py-1.5 rounded-md transition-colors ${
                                        activeAdminTab === t.key
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

                    {adminLoading && <p className="text-sm text-gray-400 font-jetbrains">Loading…</p>}
                    {!adminLoading && adminError && <p className="text-sm text-red-500 font-jetbrains">{adminError}</p>}

                    {/* pending requests */}
                    {!adminLoading && activeAdminTab === 'pending' && (
                        <div className="flex flex-col gap-y-3">
                            {pending.length === 0 ? (
                                <div className="flex flex-col items-center gap-y-2 border-2 border-dashed border-gray-300 rounded-md py-10">
                                    <Clock className="text-gray-300" size={22} />
                                    <p className="text-sm text-gray-400">No pending signup requests.</p>
                                </div>
                            ) : (
                                pending.map((u) => (
                                    <div key={u._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-2 border-gray-300 rounded-md px-4 sm:px-5 py-3">
                                        <div className="flex items-center gap-x-3 min-w-0">
                                            <div className="rounded-full w-10 h-10 border-2 border-gray-300 flex justify-center items-center overflow-hidden shrink-0">
                                                {u.profilePicture ? (
                                                    <img src={u.profilePicture} alt={u.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <User size={16} className="text-gray-400" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-bold text-sm truncate">{u.name}</div>
                                                <div className="flex items-center gap-x-1 text-xs text-gray-400 font-jetbrains truncate">
                                                    <Mail size={11} className="shrink-0" />
                                                    <span className="truncate">{u.email}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-x-2 self-end sm:self-auto">
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
                    {!adminLoading && activeAdminTab === 'members' && (
                        <div className="grid gap-4 grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
                            {members.map((u) => (
                                <div
                                    key={u._id}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => navigate(`/profile/${u._id}`)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') navigate(`/profile/${u._id}`)
                                    }}
                                    className="flex items-center gap-x-3 border-2 border-gray-300 rounded-md px-4 py-3 cursor-pointer hover:border-primary hover:shadow-md transition-all"
                                >
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
            )}

            {/* Details  */}

            <div className="flex flex-col w-[94%] sm:w-[90%] gap-y-3">
                <div className="flex flex-wrap items-center justify-between gap-y-3">
                    <div className="flex items-baseline gap-x-2">
                        <h2 className="font-bold text-lg">Your hackathons</h2>
                        <span className="font-jetbrains text-xs text-gray-400">{visibleEntries.length}</span>
                    </div>

                    {/* filter tabs */}
                    <div className="flex flex-wrap items-center gap-x-1 gap-y-1 bg-gray-100 rounded-md p-1">
                        {filters.map((f) => (
                            <button
                                key={f.key}
                                onClick={() => setActiveFilter(f.key)}
                                className={`flex items-center gap-x-1 text-xs font-jetbrains px-3 py-1.5 rounded-md transition-colors ${
                                    activeFilter === f.key
                                        ? 'bg-white text-primary shadow-sm font-bold'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {f.label}
                                <span className="text-[0.65rem] opacity-70">({counts[f.key]})</span>
                            </button>
                        ))}
                    </div>
                </div>

                {loading && <p className="text-sm text-gray-400 font-jetbrains">Loading your hackathons…</p>}
                {!loading && error && <p className="text-sm text-red-500 font-jetbrains">{error}</p>}

                {!loading && !error && entries.length === 0 && (
                    <div className="flex flex-col items-center gap-y-3 border-2 border-dashed border-gray-300 rounded-md py-10">
                        <p className="text-sm text-gray-400">You haven't joined any hackathons yet.</p>
                        <button onClick={() => navigate('/hackathons')} className="bg-primary text-white px-4 py-1.5 rounded-md text-sm">
                            Browse hackathons
                        </button>
                    </div>
                )}

                {!loading && !error && entries.length > 0 && visibleEntries.length === 0 && (
                    <div className="flex flex-col items-center gap-y-2 border-2 border-dashed border-gray-300 rounded-md py-10">
                        <Calendar className="text-gray-300" size={22} />
                        <p className="text-sm text-gray-400">Nothing in this filter yet.</p>
                    </div>
                )}

                <div className="grid gap-4 grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
                    {visibleEntries.map(({ hackathon, team }) => (
                        <div
                            key={`${hackathon._id}-${team._id}`}
                            role="button"
                            tabIndex={0}
                            onClick={() => navigate(`/hackathon/${hackathon._id}`)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') navigate(`/hackathon/${hackathon._id}`)
                            }}
                            className="border-2 border-gray-300 rounded-md p-4 cursor-pointer hover:border-primary hover:shadow-md transition-all"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className={`text-[0.65rem] font-jetbrains font-bold uppercase px-2 py-0.5 rounded-md ${statusStyles[hackathon.status] || 'bg-gray-100 text-gray-500'}`}>
                                    {hackathon.status}
                                </span>
                                <span className="text-[0.65rem] font-jetbrains text-gray-400 uppercase">{hackathon.mode}</span>
                            </div>

                            <div className="font-bold mb-0.5">{hackathon.name}</div>

                            <div className="flex items-center gap-x-1 text-xs text-gray-400 mb-1">
                                <MapPin size={12} />
                                {hackathon.location}
                            </div>

                            <div className="font-jetbrains text-xs text-primary mb-2">
                                {formatDateRange(hackathon.startDate, hackathon.endDate)}
                            </div>

                            <div className="flex justify-between items-center text-xs text-gray-500 border-t border-gray-200 pt-2">
                                <span>{team.name} · {team.role}</span>
                                <span className="flex items-center gap-x-1">
                                    <Users size={12} />
                                    {team.memberCount}/{team.maxMembers}
                                </span>
                            </div>

                            {hackathon.prizePool > 0 && (
                                <div className="flex items-center gap-x-1 text-xs font-bold text-yellow-600 mt-2">
                                    <Trophy size={12} />
                                    {formatCurrency(hackathon.prizePool)}
                                </div>
                            )}

                            {hackathon.tracks?.length > 0 && (
                                <ul className="flex flex-wrap gap-1.5 mt-2">
                                    {hackathon.tracks.slice(0, 3).map((track) => (
                                        <li key={track} className="bg-[#57DFFE]/50 text-primary text-[0.65rem] font-jetbrains px-2 py-0.5 rounded-md">
                                            {track}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            </div>


        </div>
    )
}

export default HomeComponent
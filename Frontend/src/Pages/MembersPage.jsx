import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SideBar from '../components/SideBar'
import userService from '../Api/userService'

const UserList = () => {
  const navigate = useNavigate()

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState("")

  useEffect(() => {
    let cancelled = false

    const fetchUsers = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await userService.getUsers()
        // console.log(res)
        if (!cancelled) setUsers(res || [])
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message || 'Could not load members.'
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchUsers()

    return () => {
      cancelled = true
    }
  }, [])

  const statusStyles = {
    approved: "bg-emerald-100 text-emerald-600",
    pending: "bg-amber-100 text-amber-600",
    rejected: "bg-rose-100 text-rose-600",
  }

  const roleStyles = {
    admin: "bg-indigo-100 text-indigo-600",
    user: "bg-slate-200 text-slate-600",
  }

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-100">
        <SideBar />
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <p className="text-slate-400">Loading members...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-100">
        <SideBar />
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <p className="text-rose-500">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-100">
      <SideBar />

      <div className="flex-1 md:h-screen md:overflow-y-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Members</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              {filteredUsers.length} {filteredUsers.length === 1 ? "member" : "members"}
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <svg
              className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search members..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Grid */}
        {filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredUsers.map((u) => (
              <div
                key={u._id}
                onClick={() => navigate(`/profile/${u._id}`)}
                className="group bg-white rounded-2xl shadow-sm p-5 cursor-pointer border border-transparent hover:border-indigo-200 hover:shadow-md transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center overflow-hidden shrink-0 ring-2 ring-transparent group-hover:ring-indigo-300 transition">
                    {u.profilePicture ? (
                      <img
                        src={u.profilePicture}
                        alt={u.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-bold text-indigo-600">
                        {getInitials(u.name)}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-800 truncate group-hover:text-indigo-600 transition">
                      {u.name}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{u.email}</p>
                  </div>

                  <svg
                    className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${
                      statusStyles[u.status] || "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {u.status || "unknown"}
                  </span>
                  {u.role && (
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${
                        roleStyles[u.role] || "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {u.role}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl shadow-sm">
            <svg
              className="w-10 h-10 text-slate-300 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4zm6 0a4 4 0 10-4-4M3 3l18 18"
              />
            </svg>
            <p className="text-slate-400 text-sm">
              {search ? `No members match "${search}"` : "No members found"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserList
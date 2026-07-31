import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import SideBar from '../components/SideBar'
import teamService from '../Api/teamService'
import { axiosPrivate } from '../hooks/axiosPrivate'
import { useSelector } from 'react-redux'
import { motion } from 'motion/react'
import AddTeam from '../components/addTeam'

const ROLE_STYLES = {
  Leader: 'bg-indigo-100 text-indigo-600',
  Member: 'bg-slate-100 text-slate-500',
}

const timeAgo = (dateStr) => {
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`
  const days = Math.floor(hrs / 24)
  return `${days} day${days > 1 ? 's' : ''} ago`
}

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

const initials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

const AVATAR_COLORS = [
  'bg-indigo-500',
  'bg-rose-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-sky-500',
]

const TeamDashboard = () => {
  const { team_id } = useParams()
  const id = team_id;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [confirmText, setConfirmText] = useState("");
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)
  const [team, setTeam] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)
  const [isLeader, setisLeader] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [isAddMemeber, setisAddMemeber] = useState(false);
  let cancelled = false;

 const fetchTeam = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await axiosPrivate.get(`/team/${team_id}`)
        const temp = res.data.team
        const leader = temp.members.find((m) => m.role == 'Leader').userId._id

        if (leader == user._id) {
          setisLeader(true)
        }

        if (!cancelled) {
          setTeam(res.data.team)
        }
      } catch (err) {
        if (!cancelled) {
          console.log(error)
          setError(err.response?.data?.message || 'Could not load this team.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
      
async  function  handle_delete(){
  try {
    const res= await teamService.deleteTeam(id);
    navigate(`/hackathon/${team.hackathonId}`)
    
       
  } catch (error) {
    alert(error)
    
  }

  }

  useEffect(() => {
    
    if (id) fetchTeam()

    return () => {
      cancelled = true
    }
  }, [id])

  const handleDeleteMember = async (id) => {
    try {
      const res = await teamService.removeMember(team._id, id)
      fetchTeam()
    } catch (error) {}
  }

  const handleCopyInvite = () => {
    const link = `${window.location.origin}/hackathon/join-team/${team._id}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="h-screen w-full flex bg-slate-100">
        <SideBar />
        <div className="h-screen flex-1 flex items-center justify-center">
          <p className="text-slate-400">Loading team...</p>
        </div>
      </div>
    )
  }

  if (error || !team) {
    return (
      <div className="h-screen w-full flex bg-slate-100">
        <SideBar />
        <div className="h-screen flex-1 flex items-center justify-center">
          <p className="text-rose-500">{error || 'Team not found.'}</p>
        </div>
      </div>
    )
  }

  const spotsRemaining = team.maxMembers - team.members.length
  const isOpen = spotsRemaining > 0
  const fillPct = Math.min(
    100,
    Math.round((team.members.length / team.maxMembers) * 100)
  )

  const resolveMember = (member) => {
    return {
      _id: member.userId._id,
      name: member.userId.name,
      email: member.userId.email,
    }
  }

  const activity = [
    ...team.members.map((m) => ({
      label: `${resolveMember(m).name} joined the team`,
      date: m.joinedAt,
    })),
    { label: `Team "${team.name}" was created`, date: team.createdAt },
  ].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="h-screen w-full flex bg-slate-100">
      <SideBar />

      <div className="h-screen flex-1 overflow-y-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-sm text-slate-400 mb-1">Team Dashboard</h1>
            <h2 className="text-2xl font-bold text-slate-800">{team.name}</h2>
          </div>
          <div className="flex border items-center gap-3">
            {isLeader && (
              <div className="flex gap-x-4">
                <motion.div
                      whileTap={{ scale: 0.9 }}
                      className="bg-primary text-center px-2 py-1 rounded-lg text-base flex justify-center items-center font-bold text-black"
                      onClick={() => setIsEdit((p) => !p)}
                    >
                      {!isEdit ? 'Edit ✏️' : 'Done ✔️'}
                    </motion.div>
                    <motion.div
                      whileTap={{ scale: 0.9 }}
                      className="bg-primary text-center px-2 py-1 rounded-lg text-base flex justify-center items-center font-bold text-black"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      Delete
                    </motion.div>
              </div>
            )}
            <button
              className="text-sm text-white bg-indigo-600 px-2 py-1 rounded-lg font-medium hover:bg-indigo-700 transition"
              onClick={handleCopyInvite}
            >
              {copied ? 'Link Copied!' : 'Share Team'}
            </button>
          </div>
        </div>

        {/* Top stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <p className="text-[11px] tracking-wide text-slate-400 uppercase mb-2">
              Team Size
            </p>
            <p className="text-3xl font-bold text-slate-800 mb-3">
              {team.members.length} / {team.maxMembers}
            </p>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full"
                style={{ width: `${fillPct}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {isOpen
                ? `${spotsRemaining} spot${spotsRemaining > 1 ? 's' : ''} remaining`
                : 'Team is full'}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <p className="text-[11px] tracking-wide text-slate-400 uppercase mb-2">
              Recruitment Status
            </p>
            <p className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              {isOpen ? 'Open' : 'Closed'}
              <span
                className={`w-2 h-2 rounded-full ${
                  isOpen ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              />
            </p>
            <p className="text-xs text-slate-400 mt-3">
              {isOpen
                ? 'Currently accepting new members'
                : 'No openings right now'}
            </p>
          </div>

          <div className="bg-indigo-900 rounded-2xl p-6 text-white">
            <p className="text-[11px] tracking-wide text-indigo-200 uppercase mb-1">
              Team Created
            </p>
            <p className="text-3xl font-bold mb-1">{formatDate(team.createdAt)}</p>
            <p className="text-indigo-200 text-sm">
              Last updated {timeAgo(team.updatedAt)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Members list */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-800">Active Members</h2>
                <div className="flex -space-x-2">
                  {team.members.map((m, i) => {
                    const info = resolveMember(m)
                    return (
                      <div
                        key={m._id}
                        title={info.name}
                        className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-semibold ${
                          AVATAR_COLORS[i % AVATAR_COLORS.length]
                        }`}
                      >
                        {initials(info.name)}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Header row */}
              <div className="flex items-center text-[11px] tracking-wide text-slate-400 uppercase pb-3">
                <div className="flex-[2] font-medium">Member Name</div>
                <div className="flex-1 font-medium">Role</div>
                <div className="flex-1 font-medium">Joined At</div>
                <div className="w-20 flex justify-center font-medium">
                  {isLeader && isEdit && (
                     <motion.div
                whileTap={{ scale: 0.9 }}
                className="bg-primary text-center px-2 py-1 rounded-lg text-xs  cursor-pointer font-bold text-black"
                onClick={() => setisAddMemeber((p) => !p)}
              >
                {!isAddMemeber ? 'Add Member' : 'Done'}
              </motion.div>
                   
                  )}
                </div>
              </div>

              {isAddMemeber ? (
                <div className="flex w-full justify-center">
                  <AddTeam team={team} setisAddMemeber={setisAddMemeber} fetchTeam={fetchTeam}/>
                </div>
              ) : (
                <div className="flex flex-col">
                  {team.members.map((m) => {
                    const info = resolveMember(m)
                    return (
                      <div
                        key={m._id}
                        className="flex items-center border-t border-slate-100 py-3"
                      >
                        <div className="flex-[2] flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ${AVATAR_COLORS[0]}`}
                          >
                            {initials(info.name)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">
                              {info.name}
                            </p>
                            {info.email && (
                              <p className="text-xs text-slate-400">
                                {info.email}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex-1">
                          <span
                            className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                              ROLE_STYLES[m.role] || ROLE_STYLES.Member
                            }`}
                          >
                            {m.role}
                          </span>
                        </div>

                        <div className="flex-1 text-slate-500">
                          {formatDate(m.joinedAt)}
                        </div>

                        <div className="w-20 flex justify-center text-slate-500">
                          {isLeader && isEdit && (
                            <motion.div
                              whileTap={{ scale: 0.93 }}
                              className="cursor-pointer"
                              onClick={() => {
                                handleDeleteMember(info._id)
                              }}
                            >
                              ❌
                            </motion.div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-semibold text-slate-800 mb-4">Management</h2>
              <button
                onClick={handleCopyInvite}
                className="w-full flex items-center justify-between text-left px-3 py-3 rounded-xl hover:bg-slate-50 transition"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Invite New Member
                  </p>
                  <p className="text-xs text-slate-400">Share invite link</p>
                </div>
                <span className="text-slate-300">&rsaquo;</span>
              </button>
              <button
                onClick={() =>
                  navigate(`/hackathon/team/${team._id}/preferences`)
                }
                className="w-full flex items-center justify-between text-left px-3 py-3 rounded-xl hover:bg-slate-50 transition"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Team Preferences
                  </p>
                  <p className="text-xs text-slate-400">Stack &amp; goals</p>
                </div>
                <span className="text-slate-300">&rsaquo;</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-semibold text-slate-800 mb-4">
                Recent Activity
              </h2>
              <ul className="space-y-4">
                {activity.map((a, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        i < 2 ? 'bg-indigo-600' : 'bg-slate-200'
                      }`}
                    />
                    <div>
                      <p className="text-sm text-slate-700">{a.label}</p>
                      <p className="text-xs text-slate-400">{timeAgo(a.date)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {showDeleteModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl w-[420px] p-6 shadow-xl">
      <h2 className="text-xl font-semibold text-red-600">
        Delete Team
      </h2>

      <p className="mt-3 text-slate-600">
        This action cannot be undone.
      </p>

      <p className="mt-4 text-sm">
        Type <span className="font-bold">DELETE</span> to confirm.
      </p>

      <input
        type="text"
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
        className="w-full mt-3 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
        placeholder="Type DELETE"
      />

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => {
            setShowDeleteModal(false);
            setConfirmText("");
          }}
          className="px-4 py-2 rounded-lg border"
        >
          Cancel
        </button>

        <button
          disabled={confirmText !== "DELETE"}
          onClick={async () => {
            await handle_delete();
            setShowDeleteModal(false);
            setConfirmText("");
          }}
          className={`px-4 py-2 rounded-lg text-white ${
            confirmText === "DELETE"
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  )
}

export default TeamDashboard
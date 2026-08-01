import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import SideBar from '../components/SideBar'
import userService from '../Api/userService'
import { motion } from "motion/react";
import { useSelector } from 'react-redux'

const ProfilePage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  const isOwner = user && profile && (user._id === profile._id)
  const isAdmin = user && user.role === "admin"
  const canManage = isOwner || isAdmin

  useEffect(() => {
    let cancelled = false

    const fetchProfile = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await userService.getUserProfile(id)
        if (!cancelled) setProfile(res)
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message || 'Could not load this profile.'
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    if (id) fetchProfile()

    return () => {
      cancelled = true
    }
  }, [id])

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await userService.deleteUser(id)
      navigate("/")
    } catch (error) {
      alert(error?.response?.data?.message || "Something went wrong while deleting.")
    } finally {
      setIsDeleting(false)
    }
  }

  const statusStyles = {
    approved: "bg-emerald-100 text-emerald-600",
    pending: "bg-amber-100 text-amber-600",
    rejected: "bg-rose-100 text-rose-600",
  }

  const roleStyles = {
    admin: "bg-indigo-100 text-indigo-600",
    user: "bg-slate-200 text-slate-600",
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-100">
        <SideBar />
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <p className="text-slate-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-100">
        <SideBar />
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <p className="text-rose-500">{error || "Profile not found."}</p>
        </div>
      </div>
    )
  }

  const initials = profile.name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-100">
      <SideBar />

      <div className="flex-1 md:h-screen md:overflow-y-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-sm text-slate-400 mb-4 sm:mb-6">
          Profile: <span className="text-slate-500">{profile.name}</span>
        </h1>

        <div className="max-w-3xl mx-auto">
          {/* Cover + main card */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Cover band */}
            <div className="h-24 sm:h-36 bg-gradient-to-r from-indigo-600 to-indigo-900 relative">
              {canManage && (
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex gap-2">
                  {
                    isOwner && (
                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        className="text-xs sm:text-sm text-indigo-900 bg-white px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg font-medium hover:bg-indigo-50 transition shadow-sm border border-white/20"
                        onClick={() => navigate(`/profile/edit`)}
                      >
                        Edit
                      </motion.button>
                    )}
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    className="text-xs sm:text-sm text-white bg-rose-600 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg font-medium hover:bg-rose-700 transition shadow-sm"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Delete
                  </motion.button>
                </div>
              )}
            </div>

            {/* Avatar + name block */}
            <div className="px-4 sm:px-8 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4 -mt-10 sm:-mt-14">
                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-indigo-100 border-4 border-white shadow-md flex items-center justify-center overflow-hidden shrink-0 relative z-10">
                  {profile.profilePicture ? (
                    <img
                      src={profile.profilePicture}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xl sm:text-3xl font-bold text-indigo-600">
                      {initials}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0 pt-1 sm:pt-0 sm:pb-1">
                  <h2 className="text-lg sm:text-2xl font-bold text-slate-800 truncate">
                    {profile.name}
                  </h2>
                  <p className="text-slate-400 text-xs sm:text-sm truncate">{profile.email}</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                    statusStyles[profile.status] || "bg-slate-200 text-slate-600"
                  }`}
                >
                  {profile.status}
                </span>
                {profile.role && (
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                      roleStyles[profile.role] || "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {profile.role}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Details cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
            <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">
              <p className="text-[11px] tracking-wide text-slate-400 uppercase mb-1">
                Email
              </p>
              <p className="text-slate-700 font-medium break-words">{profile.email}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">
              <p className="text-[11px] tracking-wide text-slate-400 uppercase mb-1">
                Member Since
              </p>
              <p className="text-slate-700 font-medium">
                {profile.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : "—"}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] tracking-wide text-slate-400 uppercase mb-1">
                  LinkedIn
                </p>
                {profile.linkedin && profile.linkedin.length>0? ( 
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 font-medium hover:underline truncate block"
                  >
                    View Profile
                  </a>
                ) : (
                  <p className="text-slate-400 text-sm">Not linked</p>
                )}
              </div>
              <svg className="w-6 h-6 text-indigo-600 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] tracking-wide text-slate-400 uppercase mb-1">
                  GitHub
                </p>
                {profile.github ? (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 font-medium hover:underline truncate block"
                  >
                    View Profile
                  </a>
                ) : (
                  <p className="text-slate-400 text-sm">Not linked</p>
                )}
              </div>
              <svg className="w-6 h-6 text-slate-800 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-[420px] p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-red-600">
              Delete Profile
            </h2>

            <p className="mt-3 text-slate-600">
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-semibold">{profile.name}</span>'s account.
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

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setConfirmText("")
                }}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>

              <button
                disabled={confirmText !== "DELETE" || isDeleting}
                onClick={async () => {
                  await handleDelete()
                  setShowDeleteModal(false)
                  setConfirmText("")
                }}
                className={`px-4 py-2 rounded-lg text-white ${
                  confirmText === "DELETE" && !isDeleting
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage
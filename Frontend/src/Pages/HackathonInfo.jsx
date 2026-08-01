import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import SideBar from '../components/SideBar'
import hack_service from '../Api/hackathonService'
import teamService from '../Api/teamService'
import { motion } from "motion/react";
import { useSelector } from 'react-redux'
import { axiosPrivate } from '../hooks/axiosPrivate'


const HackathonInfo = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [teams, setTeams] = useState([])
  const [isOwner, setIsOwner] = useState(false)
  const user = useSelector((state) => state.auth.user)
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const [hackathon, setHackathon] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isApiLive, setIsApiLive] = useState(false)

  useEffect(() => {
    let cancelled = false

    const fetchHackathon = async () => {
      try {
        setLoading(true)
        setError(null)

        const result = await teamService.getTeams(id)
        setTeams(result)
        const res = await hack_service.get_hackathon(id)
        const owner = res.createdBy;

        if (owner == user._id || user.role == "admin") {
          setIsOwner(true)
        }

        if (!cancelled) setHackathon(res);

      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message || 'Could not load this hackathon.'
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    if (id) fetchHackathon()

    return () => {
      cancelled = true
    }
  }, [id]);

  async function handle_delete() {
    try {
      const res = await hack_service.deleteHackaton(id);
      navigate("/hackathon")
    } catch (error) {
      alert(error)
    }
  }

  const downloadPdf = async () => {
    setIsApiLive(true);
    try {
      const res = await axiosPrivate.get(`/hackathon/pdf/${id}`, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${hackathon.name}_report.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
    } finally {
      setIsApiLive(false);
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-100">
        <SideBar />
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <p className="text-slate-400">Loading hackathon...</p>
        </div>
      </div>
    )
  }

  const data = hackathon
  const isLive =
    new Date(data.startDate) <= new Date() && new Date() <= new Date(data.endDate)

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-100">
      <SideBar />

      <div className="flex-1 md:h-screen md:overflow-y-auto p-4 sm:p-6 lg:p-8">
        {/* Page header */}
        <h1 className="text-sm text-slate-400 mb-4 sm:mb-6 break-words">
          Hackathon Details: <span className="text-slate-500">{data.name}</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left / main column */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* About card */}
            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex justify-start items-center gap-2 min-w-0">
                  <svg
                    className="w-5 h-5 text-indigo-600 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h2 className="font-semibold text-slate-800 truncate">About {data.name}</h2>
                </div>

                <div className="flex flex-wrap gap-2 sm:justify-end">
                  {isOwner && (
                    <>
                      <motion.button
                        className="text-sm text-white bg-indigo-600 px-3 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
                        onClick={() =>
                          navigate(`/hackathon/update/${hackathon._id}`)
                        }
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        className="text-sm text-white bg-indigo-600 px-3 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
                        onClick={() => setShowDeleteModal(true)}
                      >
                        Delete
                      </motion.button>
                    </>
                  )}
                  <motion.button
                    disabled={isApiLive}
                    className="text-sm text-white disabled:bg-indigo-700 bg-indigo-600 px-3 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
                    onClick={downloadPdf}
                  >
                    PDF
                  </motion.button>
                </div>
              </div>

              <p className="text-slate-400 mb-6 break-words">{data.description}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-100 rounded-xl p-3">
                  <p className="text-[11px] tracking-wide text-slate-400 uppercase">
                    Team Size
                  </p>
                  <p className="text-indigo-600 font-bold text-lg">
                    {data.teamSize}
                  </p>
                </div>
                <div className="bg-slate-100 rounded-xl p-3">
                  <p className="text-[11px] tracking-wide text-slate-400 uppercase">
                    Mode
                  </p>
                  <p className="text-indigo-600 font-bold text-lg truncate">{data.mode}</p>
                </div>
                <div className="bg-slate-100 rounded-xl p-3">
                  <p className="text-[11px] tracking-wide text-slate-400 uppercase">
                    Tracks
                  </p>
                  <p className="text-indigo-600 font-bold text-lg capitalize truncate">
                    {data.tracks?.[0]}
                  </p>
                </div>
                <div className="bg-slate-100 rounded-xl p-3">
                  <p className="text-[11px] tracking-wide text-slate-400 uppercase">
                    Fee
                  </p>
                  <p className="text-indigo-600 font-bold text-lg">
                    ${data.registrationFee}
                  </p>
                </div>
              </div>
            </div>

            {/* Featured teams card */}
            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-indigo-600 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4zm6 0a4 4 0 10-4-4"
                    />
                  </svg>
                  <h2 className="font-semibold text-slate-800">Featured Teams</h2>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    className="text-sm text-white bg-indigo-600 px-3 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
                    onClick={() =>
                      navigate(`/hackathon/addteam/?hackid=${data._id}&size=${data.teamSize}&update=false`)
                    }
                  >
                    Add Team
                  </button>

                  <button className="text-sm text-indigo-600 font-medium hover:underline">
                    View all teams &rarr;
                  </button>
                </div>
              </div>

              {teams && teams.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {teams.map((team, i) => (
                    <div
                      key={team._id || i}
                      className="border cursor-pointer rounded-xl flex flex-col sm:flex-row gap-1 sm:gap-0 p-4"
                      onClick={() => { navigate(`/hackathon/team/${team._id}`) }}
                    >
                      <div className="flex-1 truncate">{team.name}</div>
                      <div className="flex-1 truncate">{team.createdBy.name}</div>
                      <div className="flex-1 truncate">{formatDate(team.createdBy.createdAt)}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
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
                  <p className="text-slate-400 text-sm">No teams registered yet</p>
                  <p className="text-indigo-600 text-sm font-medium mt-1">
                    Be the first to form a team for {data.name}!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right / sidebar column */}
          <div className="space-y-4 sm:space-y-6">
            {/* Prize pool card */}
            <div className="bg-indigo-900 rounded-2xl p-4 sm:p-6 text-white">
              <p className="text-[11px] tracking-wide text-indigo-200 uppercase mb-1">
                Prize Pool
              </p>
              <p className="text-3xl font-bold mb-3">${data.prizePool}</p>
              <p className="text-indigo-200 text-sm mb-4 break-words">
                Location: {data.location}
              </p>
              
              <a  href={data.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-white text-indigo-900 font-semibold rounded-lg py-2 hover:bg-indigo-50 transition"
              >
                Visit Website
              </a>
            </div>

            {/* Timeline card */}
            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-800">Timeline</h2>
                {isLive && (
                  <span className="text-[11px] font-medium bg-rose-100 text-rose-500 px-2 py-0.5 rounded-full">
                    Live Now
                  </span>
                )}
              </div>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mt-0.5 shrink-0">
                    <svg
                      className="w-3.5 h-3.5 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      Start Date
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatDate(data.startDate)}
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mt-0.5 shrink-0">
                    <svg
                      className="w-3.5 h-3.5 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      End Date
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatDate(data.endDate)}
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center mt-0.5 shrink-0">
                    <svg
                      className="w-3.5 h-3.5 text-rose-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      Registration Deadline
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatDate(data.registrationDeadline)}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-[420px] p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-red-600">
              Delete Hackathon
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

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6">
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

export default HackathonInfo
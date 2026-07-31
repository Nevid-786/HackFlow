import React from 'react'
import SideBar from '../components/SideBar'
import { useEffect, useState, useMemo } from "react";
import HackathonService from "../api/HackathonService";
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, Calendar, MapPin, Clock } from 'lucide-react';

// Options shown in the "rows per page" dropdown
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

function Hackathon() {
    // ---------- Data state ----------
    const [hackathons, setHackathons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState([]);

    // ---------- Search state ----------
    const [searchTerm, setSearchTerm] = useState("");

    // ---------- Pagination state ----------
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const navigate = useNavigate();

    // ---------- Fetch hackathons on mount ----------
    useEffect(() => {
        const fetchHackathons = async () => {
            try {
                const data = await HackathonService.get_hackathons();
                console.log("list hackathon:", data);
                setHackathons(data);
            } catch (err) {
                setErrors(err.errors || ["Something went wrong"]);
            } finally {
                setLoading(false);
            }
        };

        fetchHackathons();
    }, []);

    // ---------- Formatters ----------
    const formatRegistrationDeadline = (date) => {
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(new Date(date));
    };

    const formatDuration = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const sameMonth = start.getMonth() === end.getMonth();
        const sameYear = start.getFullYear() === end.getFullYear();

        if (sameMonth && sameYear) {
            // Nov 12–18, 2026
            return `${start.toLocaleString("en-US", { month: "short" })} ${start.getDate()}-${end.getDate()}, ${start.getFullYear()}`;
        }

        // Nov 28 - Dec 2, 2026
        return `${start.toLocaleString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
    };

    // ---------- Derived: filtered list (search) ----------
    const filteredHackathons = useMemo(() => {
        if (!searchTerm.trim()) return hackathons;
        const q = searchTerm.toLowerCase();
        return hackathons.filter(
            (h) =>
                h.name?.toLowerCase().includes(q) ||
                h.location?.toLowerCase().includes(q)
        );
    }, [hackathons, searchTerm]);

    // ---------- Derived: paginated slice of the filtered list ----------
    const totalPages = Math.max(1, Math.ceil(filteredHackathons.length / pageSize));

    // Clamp current page in case pageSize/search shrinks the list
    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(1);
    }, [totalPages, currentPage]);

    const paginatedHackathons = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredHackathons.slice(start, start + pageSize);
    }, [filteredHackathons, currentPage, pageSize]);

    const rangeStart = filteredHackathons.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const rangeEnd = Math.min(currentPage * pageSize, filteredHackathons.length);

    // ---------- Render ----------
    return (
        <div className='flex w-full h-screen overflow-hidden bg-[#FBF8FF]'>
            {/* ===== Sidebar navigation ===== */}
            <SideBar />

            {loading ? (
                // ===== Loading state =====
                <div className="flex flex-1 items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
                        <p className="font-jetbrains text-sm text-gray-500">Loading hackathons...</p>
                    </div>
                </div>
            ) : (
                <div className="flex h-screen w-full items-start justify-center overflow-y-auto pt-14 pb-10">
                    <div className="flex w-[70vw] flex-col">

                        {/* ===== Page header: title + search + filter ===== */}
                        <div className="flex w-full flex-wrap items-center gap-y-3 py-4 px-1">
                            <div className="flex-1 p-3">
                                <div className="font-jetbrains flex flex-1 flex-col text-4xl font-bold text-slate-800">
                                    Hackathon List
                                </div>
                                <span className='text-[0.7rem] font-semibold text-slate-500'>
                                    Manage and explore all upcoming competitions
                                </span>
                            </div>

                            <div className="flex flex-1 items-center justify-end gap-x-2 p-1">
                                {/* Search box (now functional, filters by name/location) */}
                                <div className="relative">
                                    <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setCurrentPage(1); // reset to page 1 on new search
                                        }}
                                        name="search_hackathon"
                                        placeholder='Search by name or location'
                                        className='font-jetbrains w-64 rounded-md border border-[#C6C4D9] bg-white py-2 pl-9 pr-3 text-sm text-gray-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'
                                    />
                                </div>

                                <button className='font-jetbrains flex items-center gap-1 rounded-md border border-[#C6C4D9] bg-white px-3 py-2 text-sm text-gray-700 transition hover:bg-slate-50'>
                                    <SlidersHorizontal size={14} />
                                    Filter
                                </button>
                            </div>
                        </div>

                        {/* ===== Main table card ===== */}
                        <div className="flex w-full flex-col overflow-hidden rounded-xl border border-[#C6C4D9] shadow-sm">

                            {/* --- Table header row --- */}
                            <div className="font-Hanken flex w-full justify-between rounded-t-xl bg-gradient-to-r from-[#C6C4D9] to-[#D8D6EC] p-3 text-lg font-semibold text-slate-800">
                                <span className='flex flex-1 justify-start'>Hackathon Name</span>
                                <span className='flex flex-1 justify-center'>Date</span>
                                <span className='flex flex-1 justify-center'>Location</span>
                                <span className='flex flex-1 justify-end'>Deadline</span>
                            </div>

                            {/* --- Table body: paginated hackathon rows --- */}
                            <div className="w-full divide-y divide-[#E4E2F2] bg-white">
                                {paginatedHackathons && paginatedHackathons.length > 0 ? (
                                    paginatedHackathons.map((hackathon) => (
                                        <div
                                            key={hackathon?._id}
                                            onClick={() => { navigate(`/hackathon/${hackathon?._id}`) }}
                                            className="font-jetbrains flex w-full cursor-pointer justify-between p-3 text-base text-slate-700 transition hover:bg-indigo-50"
                                        >
                                            <span className='flex flex-1 items-center gap-2 font-medium text-slate-800'>
                                                {hackathon.name}
                                            </span>

                                            <span className='flex flex-1 items-center justify-center gap-1 text-slate-600'>
                                                <Calendar size={14} className="text-indigo-400" />
                                                {formatDuration(hackathon.startDate, hackathon.endDate)}
                                            </span>

                                            <span className='flex flex-1 items-center justify-center gap-1 text-slate-600'>
                                                <MapPin size={14} className="text-indigo-400" />
                                                {hackathon.location}
                                            </span>

                                            <span className='flex flex-1 items-center justify-end gap-1 text-slate-600'>
                                                <Clock size={14} className="text-indigo-400" />
                                                {formatRegistrationDeadline(hackathon.registrationDeadline)}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    // --- Empty state (no results after search/filter) ---
                                    <div className="flex flex-col items-center justify-center gap-1 py-10 text-slate-400">
                                        <p className="font-jetbrains text-sm">No hackathons found.</p>
                                    </div>
                                )}
                            </div>

                            {/* ===== Footer: page size selector + pagination controls ===== */}
                            <div className="flex w-full flex-wrap items-center justify-between gap-3 rounded-b-xl bg-[#F5F4FB] p-3 text-sm text-slate-600">

                                {/* --- Left: rows-per-page selector + result count --- */}
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <span className="font-jetbrains">Show</span>
                                        <select
                                            value={pageSize}
                                            onChange={(e) => {
                                                setPageSize(Number(e.target.value));
                                                setCurrentPage(1); // reset to page 1 on page size change
                                            }}
                                            className="rounded-md border border-[#C6C4D9] bg-white px-2 py-1 text-sm outline-none focus:border-indigo-400"
                                        >
                                            {PAGE_SIZE_OPTIONS.map((size) => (
                                                <option key={size} value={size}>{size}</option>
                                            ))}
                                        </select>
                                        <span className="font-jetbrains">per page</span>
                                    </div>

                                    <span className="font-jetbrains hidden text-xs text-slate-400 sm:inline">
                                        Showing {rangeStart}-{rangeEnd} of {filteredHackathons.length}
                                    </span>
                                </div>

                                {/* --- Right: prev / page number / next --- */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="flex items-center gap-1 rounded-md border border-[#C6C4D9] bg-white px-2 py-1 text-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <ChevronLeft size={14} />
                                        Prev
                                    </button>

                                    <span className="font-jetbrains px-2 text-sm">
                                        Page {currentPage} of {totalPages}
                                    </span>

                                    <button
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="flex items-center gap-1 rounded-md border border-[#C6C4D9] bg-white px-2 py-1 text-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Next
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Hackathon;
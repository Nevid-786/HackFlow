import React from 'react'
import SideBar from '../components/SideBar'
import { useEffect, useState, useMemo, useRef } from "react";
import HackathonService from "../Api/HackathonService";
import { useNavigate } from 'react-router-dom';
import {
    Search,
    SlidersHorizontal,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Calendar,
    MapPin,
    Clock,
    FileDown,
    Check,
    X,
} from 'lucide-react';

// Options shown in the "rows per page" dropdown
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

// Category filters, combined with the search term
const FILTER_OPTIONS = [
    { value: "all", label: "All Hackathons" },
    { value: "upcoming", label: "Upcoming" },
    { value: "ongoing", label: "Ongoing" },
    { value: "past", label: "Past" },
    { value: "registrationOpen", label: "Registration Open" },
];

// Derives a category from dates rather than relying on a possibly-stale
// `status` field in the DB, so it stays correct as time passes.
const getHackathonCategory = (hackathon) => {
    const now = new Date();
    const start = new Date(hackathon.startDate);
    const end = new Date(hackathon.endDate);

    if (now < start) return "upcoming";
    if (now > end) return "past";
    return "ongoing";
};

const isRegistrationOpen = (hackathon) => {
    if (!hackathon.registrationDeadline) return false;
    return new Date(hackathon.registrationDeadline) > new Date();
};

function Hackathon() {
    // ---------- Data state ----------
    const [hackathons, setHackathons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState([]);

    // ---------- Search & filter state ----------
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    // ---------- Pagination state ----------
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // ---------- PDF select-and-download state ----------
    const [pdfMode, setPdfMode] = useState(false); // checkboxes shown once this is true
    const [selectedIds, setSelectedIds] = useState([]);
    const [downloading, setDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState("");

    const navigate = useNavigate();
    const filterMenuRef = useRef(null);

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

    // ---------- Close the filter dropdown on outside click ----------
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (filterMenuRef.current && !filterMenuRef.current.contains(e.target)) {
                setShowFilterMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
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

    // ---------- Derived: filtered list (search + category) ----------
    const filteredHackathons = useMemo(() => {
        let list = hackathons;

        if (filterCategory !== "all") {
            list = list.filter((h) => {
                if (filterCategory === "registrationOpen") return isRegistrationOpen(h);
                return getHackathonCategory(h) === filterCategory;
            });
        }

        if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase();
            list = list.filter(
                (h) =>
                    h.name?.toLowerCase().includes(q) ||
                    h.location?.toLowerCase().includes(q)
            );
        }

        return list;
    }, [hackathons, searchTerm, filterCategory]);

    // ---------- Derived: paginated slice of the filtered list ----------
    const totalPages = Math.max(1, Math.ceil(filteredHackathons.length / pageSize));

    // Clamp current page in case pageSize/search/filter shrinks the list
    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(1);
    }, [totalPages, currentPage]);

    const paginatedHackathons = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredHackathons.slice(start, start + pageSize);
    }, [filteredHackathons, currentPage, pageSize]);

    const rangeStart = filteredHackathons.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const rangeEnd = Math.min(currentPage * pageSize, filteredHackathons.length);

    // ---------- PDF mode handlers ----------
    const togglePdfMode = () => {
        setDownloadError("");
        setPdfMode((prev) => {
            const next = !prev;
            if (!next) setSelectedIds([]); // clear selection when closing the mode
            return next;
        });
    };

    const toggleSelect = (e, id) => {
        e.stopPropagation(); // don't trigger the row's navigate-on-click
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleDownloadCombinedPdf = async () => {
        if (selectedIds.length === 0) return;
        setDownloading(true);
        setDownloadError("");
        try {
            const blob = await HackathonService.get_combined_hackathons_pdf(selectedIds);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "combined_hackathons_report.pdf";
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            // Collapse back to the normal view after a successful download
            setPdfMode(false);
            setSelectedIds([]);
        } catch (err) {
            setDownloadError(err?.errors?.[0] || err?.message || "Failed to download PDF");
        } finally {
            setDownloading(false);
        }
    };

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
                <div className="flex h-screen w-full items-start justify-center overflow-y-auto pt-6 pb-10 sm:pt-14">
                    <div className="flex w-full max-w-6xl flex-col px-3 sm:px-6">

                        {/* ===== Page header: title + search + filter ===== */}
                        <div className="flex w-full flex-col gap-y-3 py-4 px-1 sm:flex-row sm:flex-wrap sm:items-center">
                            <div className="flex-1 p-1 sm:p-3">
                                <div className="font-jetbrains flex flex-1 flex-col text-2xl font-bold text-slate-800 sm:text-4xl">
                                    Hackathon List
                                </div>
                                <span className='text-[0.7rem] font-semibold text-slate-500'>
                                    Manage and explore all upcoming competitions
                                </span>
                            </div>

                            <div className="flex flex-1 flex-wrap items-center justify-start gap-2 p-1 sm:justify-end">
                                {/* Search box (filters by name/location) */}
                                <div className="relative w-full sm:w-64">
                                    <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setCurrentPage(1); // reset to page 1 on new search
                                        }}
                                        name="search_hackathon"
                                        placeholder='Search by name or location'
                                        className='font-jetbrains w-full rounded-md border border-[#C6C4D9] bg-white py-2 pl-9 pr-3 text-sm text-gray-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'
                                    />
                                </div>

                                {/* Category filter dropdown (combines with search) */}
                                <div className="relative" ref={filterMenuRef}>
                                    <button
                                        onClick={() => setShowFilterMenu((prev) => !prev)}
                                        className='font-jetbrains flex items-center gap-1 rounded-md border border-[#C6C4D9] bg-white px-3 py-2 text-sm text-gray-700 transition hover:bg-slate-50'
                                    >
                                        <SlidersHorizontal size={14} />
                                        {FILTER_OPTIONS.find((f) => f.value === filterCategory)?.label ?? "Filter"}
                                        <ChevronDown size={14} />
                                    </button>

                                    {showFilterMenu && (
                                        <div className="absolute right-0 top-full z-10 mt-1 w-48 overflow-hidden rounded-md border border-[#C6C4D9] bg-white shadow-lg">
                                            {FILTER_OPTIONS.map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => {
                                                        setFilterCategory(opt.value);
                                                        setCurrentPage(1);
                                                        setShowFilterMenu(false);
                                                    }}
                                                    className={`font-jetbrains flex w-full items-center justify-between px-3 py-2 text-left text-sm transition hover:bg-indigo-50 ${
                                                        filterCategory === opt.value ? "bg-indigo-50 text-indigo-700" : "text-slate-700"
                                                    }`}
                                                >
                                                    {opt.label}
                                                    {filterCategory === opt.value && <Check size={14} />}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* PDF mode toggle — reveals checkboxes on each row */}
                                <button
                                    onClick={togglePdfMode}
                                    className={`font-jetbrains flex items-center gap-1 rounded-md border px-3 py-2 text-sm transition ${
                                        pdfMode
                                            ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                                            : "border-[#C6C4D9] bg-white text-gray-700 hover:bg-slate-50"
                                    }`}
                                >
                                    {pdfMode ? <X size={14} /> : <FileDown size={14} />}
                                    {pdfMode ? "Cancel" : "PDF"}
                                </button>

                                {/* Download button — only shown once at least one row is selected */}
                                {pdfMode && selectedIds.length > 0 && (
                                    <button
                                        onClick={handleDownloadCombinedPdf}
                                        disabled={downloading}
                                        className="font-jetbrains flex items-center gap-1 rounded-md bg-indigo-600 px-3 py-2 text-sm text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {downloading ? (
                                            <>
                                                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                                Preparing...
                                            </>
                                        ) : (
                                            <>
                                                <FileDown size={14} />
                                                Download ({selectedIds.length})
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>

                        {downloadError && (
                            <div className="mx-1 mb-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                                {downloadError}
                            </div>
                        )}

                        {/* ===== Main table card ===== */}
                        <div className="flex w-full flex-col overflow-hidden rounded-xl border border-[#C6C4D9] shadow-sm">

                            {/* --- Table header row (desktop only — mobile uses stacked cards instead) --- */}
                            <div className="font-Hanken hidden w-full items-center justify-between rounded-t-xl bg-gradient-to-r from-[#C6C4D9] to-[#D8D6EC] p-3 text-lg font-semibold text-slate-800 sm:flex">
                                {pdfMode && <span className="w-8 shrink-0" />}
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
                                            onClick={() => {
                                                if (pdfMode) return; // in select mode, clicks toggle the checkbox instead
                                                navigate(`/hackathon/${hackathon?._id}`)
                                            }}
                                            className="font-jetbrains flex w-full cursor-pointer flex-col gap-2 p-3 text-sm text-slate-700 transition hover:bg-indigo-50 sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:text-base"
                                        >
                                            <span className='flex flex-1 items-center gap-2 font-medium text-slate-800'>
                                                {pdfMode && (
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIds.includes(hackathon._id)}
                                                        onChange={(e) => toggleSelect(e, hackathon._id)}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="h-4 w-4 shrink-0 cursor-pointer rounded border-[#C6C4D9] text-indigo-600 focus:ring-indigo-400"
                                                    />
                                                )}
                                                <span className="break-words">{hackathon.name}</span>
                                            </span>

                                            <span className='flex flex-1 items-center gap-1 text-slate-600 sm:justify-center'>
                                                <Calendar size={14} className="shrink-0 text-indigo-400" />
                                                {formatDuration(hackathon.startDate, hackathon.endDate)}
                                            </span>

                                            <span className='flex flex-1 items-center gap-1 text-slate-600 sm:justify-center'>
                                                <MapPin size={14} className="shrink-0 text-indigo-400" />
                                                {hackathon.location}
                                            </span>

                                            <span className='flex flex-1 items-center gap-1 text-slate-600 sm:justify-end'>
                                                <Clock size={14} className="shrink-0 text-indigo-400" />
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
                            <div className="flex w-full flex-col items-stretch gap-3 rounded-b-xl bg-[#F5F4FB] p-3 text-sm text-slate-600 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">

                                {/* --- Left: rows-per-page selector + result count --- */}
                                <div className="flex flex-wrap items-center gap-3">
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
                                <div className="flex items-center justify-between gap-2 sm:justify-end">
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
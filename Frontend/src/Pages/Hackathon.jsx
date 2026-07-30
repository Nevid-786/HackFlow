import React from 'react'
import SideBar from '../components/SideBar'

import { useEffect, useState } from "react";
import HackathonService from "../api/HackathonService";
import { useNavigate } from 'react-router-dom';

function Hackathon() {
    const [hackathons, setHackathons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState([]);
    const navigate=useNavigate()

    useEffect(() => {
        const fetchHackathons = async () => {
            try {
                const data = await HackathonService.get_hackathons();
                console.log("list hackathon:", data)
                setHackathons(data);
            } catch (err) {
                setErrors(err.errors || ["Something went wrong"]);
            } finally {
                setLoading(false);
            }
        };

        fetchHackathons();
    }, []);
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
            return `${start.toLocaleString("en-US", {
                month: "short",
            })} ${start.getDate()}-${end.getDate()}, ${start.getFullYear()}`;
        }

        // Nov 28 - Dec 2, 2026
        return `${start.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
        })} - ${end.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })}`;
    };



    
      
    
    return (
        <div className='flex w-full h-screen  overflow-hidden'>
            <SideBar />
            {
                loading?<p>loading.....</p>:
                (
                    <div className="flex  justify-center h-screen items-start pt-14 w-full bg-[#FBF8FF]">
                <div className="flex w-[70vw]  flex-col">
                    <div className=" h-[20%] w-full flex py-4 px-1  ">
                        <div className="flex-1  p-3">

                            <div className=" text-4xl flex flex-col font-bold flex-1 font-jetbrains ">
                                Hackathon List

                            </div>
                            <span className='text-[0.7rem] font-semibold'>
                                Manage and explore all upcoming competitions
                            </span>
                        </div>

                        <div className="flex flex-1 justify-end gap-x-2 items-center  p-1">

                            <input value="nextHack" name="search_hackathon" placeholder='Search Hackathon' className='font-jetbrains border rounded-md outline-none  p-2 text-lg text-gray-700'>
                            </input>
                            <button className='font-jetbrains border rounded-md text-lg    py-2 px-1  bg-white  text-gray-700'>
                                Filter
                            </button>
                        </div>


                    </div>
                    <div className="flex flex-col w-full  border border-[#C6C4D9]  rounded-xl overflow-hidden">
                        <div className="flex w-full font-Hanken justify-between p-3 rounded-tl-xl rouded-tr-xl bg-[#C6C4D9] font-semibold text-xl ">
                            <span className='flex-1 flex justify-start'> Hackathon Name</span>
                            <span className='flex-1 flex justify-center'> Date</span>
                            <span className='flex-1 flex justify-center'> Location</span>
                            <span className='flex-1 flex justify-end'> DeadLine</span>

                        </div>
                        <div className="w-full ">
                            
                        {
                            hackathons && hackathons.length > 0 ? (
                                hackathons.map((hackathon) => (
                                    <div
                                        key={hackathon?._id} onClick={()=>{navigate(`/hackathon/${hackathon?._id}`)}}
                                        className="flex w-full cursor-pointer font-jetbrains text-lg justify-between border-t-2 border-[#C6C4D9] p-2"
                                    >
                                        <span className='flex-1'>{hackathon.name}</span>

                                        {/* Duration */}
                                        <span className='flex-1 text-center'>
                                            {formatDuration(hackathon.startDate, hackathon.endDate)}
                                        </span>

                                        {/* Registration Deadline */}
                                        <span className='flex-1 text-center'>{hackathon.location}</span>
                                        <span className='flex-1 text-right'>
                                            {formatRegistrationDeadline(hackathon.registrationDeadline)}
                                        </span>

                                    </div>
                                ))
                            ) : (
                                ""
                            )
                        }

                        </div>

                        <div className="flex w-full justify-between p-3 rounded-br-xl rounded-bl-xl bg-[#C6C4D9] font-semibold text-xl ">
                            <span> Hackathon Name</span>
                            <span> Date</span>
                            <span> Location</span>

                        </div>




                    </div>

                </div>
            </div>
       
                )
            }
             </div>
    )
}

export default Hackathon
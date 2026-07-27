import { CalendarCheck, Home, LucideCirclePoundSterling } from 'lucide-react'
import React from 'react'
import {useNavigate} from "react-router-dom"
const SideBar = () => {
    const navigate= useNavigate()
    
  return (
    <div className='flex flex-col  w-{30%} border-[#C7C4D7] justify-between h-full px-2 py-5 bg-[#EFF4FF] '>
        <div className="flex flex-col ">
            <div className="flex flex-col font-Hanken text-3xl top-0  font-bold text-primary ">
            Hack Flow
        </div>
        <div className="flex flex-col border-t-2 font-jetbrains ">
            <ul className='py-2 space-y-2'>
                <li className='hover:bg-slate-200 rounded-md flex gap-x-4 p-2' onClick={()=>{navigate("/home")}}><span className='h-4 w-4'><Home/></span>Home</li>
                <li className='hover:bg-slate-200 rounded-md flex gap-x-4 p-2 '><span className='h-4 w-4'><CalendarCheck/></span>Hackathons</li>
                <li className='hover:bg-slate-200  rounded-md flex gap-x-4 p-2'><span className='h-4 w-4'><LucideCirclePoundSterling/></span>Expenses</li>
            </ul>
        </div>
        </div>
        <div className=" flex flex-col border-t-2 font-jetbrains ">
            <ul className='[&>*li]:p-4 '>
                <li className='bg-primary rounded p-2 hover:bg-slate-200' onClick={()=>{navigate("/posthackathon")}}>Add Hackathon</li>
                <li  className=' rounded p-2 hover:bg-slate-200 '>Help</li>
                <li className=' rounded p-2 hover:bg-slate-200'>Contact</li>
            </ul>
        </div>
    </div>
  )
}

export default SideBar
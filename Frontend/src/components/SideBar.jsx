import { CalendarCheck, Home, LucideCirclePoundSterling, MenuSquare, X } from 'lucide-react'
import {React,useState} from 'react'
import {useNavigate} from "react-router-dom"
import { motion } from 'motion/react'
import Hackathon from '../Pages/Hackathon'
const SideBar = () => {
    const navigate= useNavigate();
    const [isSideBar, setIsSideBar] = useState(false)
    const [selected, setSelected] = useState("Home");
    
  return (
    <>
      <button className='fixed top-4 left-4 z-50 md:hidden p-2 bg-primary rounded-md' onClick={() => setIsSideBar(!isSideBar)}>
        {isSideBar ? <X className='h-6 w-6' /> : <MenuSquare className='h-6 w-6' />}
      </button>
      <div className={`flex flex-col fixed md:relative w-[70%] md:w-[30%] border-[#C7C4D7] justify-between h-full px-2 py-5 bg-[#EFF4FF] z-40 transition-all duration-300 ${isSideBar ? "left-0" : "-left-full"} md:left-0`}>
        
        <div className="flex flex-col ">
            <div className="flex flex-col font-Hanken text-3xl top-0  font-bold text-primary ">
            Hack Flow
        </div>
        <div className="flex flex-col border-t-2 font-jetbrains ">
            <ul className='py-2 space-y-2'>
                <li className={` rounded-md flex cursor-pointer gap-x-4 p-2 ${location.pathname=="/home"?"bg-primary":""}`} onClick={()=>{navigate("/home"); setSelected(Home)}}><span className='h-4 w-4'><Home/></span>Home</li>
                <li className={` rounded-md flex cursor-pointer gap-x-4 p-2 ${location.pathname=="/hackathon"?"bg-primary":""}`} onClick={()=>{navigate("/hackathon") ;setSelected("Hackathons")}}><span className='h-4 w-4'><CalendarCheck/></span>Hackathons</li>
                <li className={` rounded-md flex cursor-pointer gap-x-4 p-2 ${location.pathname=="/expenses"?"bg-primary":""}`}  onClick={()=>{navigate("/hackathon") ;setSelected("Expenses")}}><span className='h-4 w-4'><LucideCirclePoundSterling/></span>Expenses</li>
            </ul>
        </div>
        </div>
        <div className=" flex flex-col border-t-2 font-jetbrains ">
            <ul className='[&>*li]:p-4 '>
                <motion.li
                whileTap={{scale:0.8}}
                 className='bg-primary rounded p-2 hover:bg-slate-200' onClick={()=>{navigate("/posthackathon")}}>Add Hackathon</motion.li>
                <li  className=' rounded p-2 hover:bg-slate-200 '>Help</li>
                <li className=' rounded p-2 hover:bg-slate-200'>Contact</li>
            </ul>
        </div>
    </div>
    </>

  )
   
  
}

export default SideBar
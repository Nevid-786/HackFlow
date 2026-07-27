import { Share2, User } from 'lucide-react'
import React from 'react'

const HomeComponent = () => {
    return (
        <div className='w-full h-full border-5 flex flex-col items-center gap-y-4 py-4'>

            {/* Profile part */}
            <div className="flex justify-between items-center px-8 py-4 border-gray-300 border-2  h-20 w-[90%] rounded-md">
                <div className="Profile flex justify-around items-center gap-x-3 p-2">
                    <div className="ProfilePic rounded-full w-10 h-10 border-2 border-gray-300 flex justify-center items-center">
                        <User></User>
                    </div>

                    {/* Name */}
                    <div className=" flex flex-col items-start">
                        <div className="Name font-bold ">Nevid Alam</div>
                        <div><ul className='flex gap-x-3'>
                            <li className="bg-[#57DFFE]/50 flex justify-center items-center text-primary p-1 text-xs font-jetbrains rounded-md">Html</li>
                            <li className="bg-[#57DFFE]/50 flex justify-center items-center text-primary p-1 text-xs font-jetbrains rounded-md">CSS</li>
                            <li className="bg-[#57DFFE]/50 flex justify-center items-center text-primary p-1 text-xs font-jetbrains rounded-md">JS</li>
                        </ul></div>
                    </div>
                </div>



                <div className="flex gap-x-2 items-center ">
                    <span className='flex items-center w-5 h-6 gap-x-2'>
                        <Share2 />
                    </span>
                    <button className='bg-primary text-white px-4 py-1 rounded-md'>Edit</button>
                </div>


            </div>
            {/* Details  */}

            <div className="flex">
            </div>


        </div>
    )
}

export default HomeComponent
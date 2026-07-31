import React from 'react'
import AddTeam from '../components/addTeam'
import SideBar from '../components/SideBar'

const CreateTeam = () => {
  return (
     <div className="w-full h-screen flex">
            <SideBar />
             <div className="h-screen flex-1 font-jetbrains text-xl font-bold">
                <AddTeam/>
             </div>
            </div>
  )
}

export default CreateTeam
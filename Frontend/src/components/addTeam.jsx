import React, { useState, useEffect } from 'react'
import SideBar from './SideBar'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import userService from '../Api/userService'
import teamService from '../Api/teamService'


const AddTeam = ({team,setisAddMemeber,fetchTeam}) => {
    const [name, setName] = useState('')
    const [hackathonId, setHackathonId] = useState('')
    const [maxMembers, setMaxMembers] = useState(4)
    const [createdBy, setCreatedBy] = useState('')
    const [searchParams] = useSearchParams();
    const hack_id = searchParams.get("hackid");
    const [isUpdate, setisUpdate] = useState(false)
    const size = searchParams.get("size")||team.maxMembers;
    const user = useSelector((state) => state.auth.user)
    const user_id = user._id;
    const [users, setUsers] = useState([])
const navigate=useNavigate();
// const [, setTeam] = useState({});


    const [selectedMembers, setSelectedMembers] = useState([]);

    const handleSelect = (e) => {
        const userId = e.target.value;

        if (!userId) return;

        const user = users.find((u) => u._id === userId);

        // Prevent duplicates
        if (selectedMembers.some((u) => u._id === userId)) return;

        setSelectedMembers((prev) => [...prev, user]);

        // Reset dropdown
        e.target.value = "";
    };

    const removeMember = (id) => {
        setSelectedMembers((prev) =>
            prev.filter((member) => member._id !== id)
        );
    };
  

    useEffect(() => {
        setHackathonId(hack_id);
        setCreatedBy(user_id);
        setMaxMembers(size);
        setSelectedMembers((p)=>[...p,user])
        try {
            const fetchUsers = async () => {
                const users = await userService.getUsers();
                
              
            if(team){
            setisUpdate(true)
            setName(team.name)
                const members_in_team=team.members.map((m)=>m.userId._id)
              const users_not_in_team= users.filter((u)=>(!members_in_team.includes(u._id)))
              setUsers(users_not_in_team)
              return
            }
              setUsers(users)
              return

            }
            fetchUsers()
            // if(team){
            //     setSelectedMembers((p))
            // }
            

        } catch (error) {
            console.log(error)
        }
        return () => {

        }
    }, [])



    const handleUpdate = async (e) => {
        e.preventDefault()
        const selectedMembersIds=selectedMembers.map((s)=>s._id);
        const payload = {name,
            members:selectedMembersIds
         }
        try {
            const res= await teamService.addMember(team?._id,payload);
            console.log("team:",res)
            fetchTeam()

            setisAddMemeber(false)
            
        } catch (error) {
            console.log(error)
        }
      
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const selectedMembersIds=selectedMembers.map((s)=>s._id);
        const payload = { name, hackathonId, maxMembers, createdBy,
            members:selectedMembersIds
         }
        // TODO: send payload to backend
        console.log('Create team payload:', payload)
        // reset
        try {
            const team= await teamService.addTeam(payload);
            console.log("team:",team)

            navigate(`/hackathon/${hack_id}`)
            
        } catch (error) {
            console.log(error)
        }
        // setName('')
        // setHackathonId('')
        // setMaxMembers(4)
        // setCreatedBy('')
    }

    return (
        
                <div className="flex justify-center items-center flex-col ">
                    <h2 className="text-2xl mb-4">{isUpdate?"Add Members":"Create Team"}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4 max-w-md border border-black p-4 rounded-lg w-[50vw]">
                        <div>
                            <label className="block text-sm">Team Name</label>
                            <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full border p-2" />
                        </div>

                        <div>
                            <label className="block text-sm">Max Members</label>
                            <input type="number" value={maxMembers} disabled={true}  onChange={(e) => setMaxMembers(Number(e.target.value))} min={1} className="w-full rounded-lg  bg-gray-400 border p-2" />
                        </div>
                        <div>
                            <div className="flex flex-col ">
                             <h3>Selected Members</h3>

                            {selectedMembers.map((member) => (
                                <div key={member._id} className='flex justify-between items-center border p-2 rounded-lg bg-gray-300'>
                                   <span className='font-jetbrains' > {member.name}</span>
                                    <button  onClick={() => removeMember(member._id)} className='bg-red-600 py-1 px-2 rounded-lg font-jetbrains
                                     text-white'>
                                        Remove
                                    </button>
                                </div>
                            ))}
                           </div>
                            <select defaultValue="" onChange={handleSelect} className='w-full border outline-none mt-3 font-jetbrains rounded-md p-2 shadow-sm '>
                                <option value="">Select Member</option>

                                {users.map((user) => (
                                    selectedMembers.some((u)=>u._id==user._id)?null:(<option key={user._id} value={user._id}>
                                        {user.name}
                                    </option>)
                                ))}
                            </select>

                           
                        </div>



                     <div className="flex justify-center items-center">
                           <button onClick={isUpdate ? handleUpdate : handleSubmit}  className="px-4 py-2 bg-blue-600 text-white">{isUpdate?"update":"Create"}</button>
                     </div>
                    </form>
                </div>
    )
}

export default AddTeam
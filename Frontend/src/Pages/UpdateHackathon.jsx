import {React,useState ,useEffect } from 'react'
import PostComponent from '../components/PostComponent'
import { Sidebar } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import hack_service from '../Api/hackathonService'

const UpdateHackathon = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)


  const [hackathon, setHackathon] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false;

    const fetchHackathon = async () => {
      try {
        setLoading(true)
        setError(null)
     
        
    
        const res = await hack_service.get_hackathon(id);
        console.log(res)
        setHackathon(res)
        if (owner == user._id) {
          setIsOwner(true)
        }

       
         
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
 
  return (
    <div className='flex w-full h-screen border'>
      <Sidebar/>
      <PostComponent data={hackathon}/>
    </div>
  )
}

export default UpdateHackathon
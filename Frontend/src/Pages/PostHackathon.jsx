import React from 'react'
import SideBar from '../components/SideBar'
import PostComponent from '../components/PostComponent'

const PostHackathon = () => {
  return (
    <div className='flex w-full h-screen border'>
      <SideBar/>
      <PostComponent/>
    </div>
  )
}

export default PostHackathon 
import React from 'react'
import SideBar from '../components/SideBar'
import HomeComponent from '../components/HomeComponent'

const Home = () => {
  return (
    <div className='flex w-full h-screen border'>
      <SideBar/>
      <HomeComponent/>
    </div>
  )
}

export default Home
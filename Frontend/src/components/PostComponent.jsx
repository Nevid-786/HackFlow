import { Share2, User } from 'lucide-react'
import React from 'react'

const PostComponent = () => {
  const [formData, setFormData] = React.useState({
    "name": "",
    "website": "",
    "startDate": "",
    "endDate": "",
    "location": "",
    "teamSize": "",
    "description": "",
    "tracks": "",
  })
  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(formData);
  }

  return (
    <div className='w-full bg-[#C6C4D9] h-full border-5 flex flex-col items-center gap-y-4 py-4'>

      <div className="flex flex-col  w-full  h-full justify-center items-center">

        <form className="[&_*input]:outline-2  [&_*input]:p-4 w-[60%] bg-[#FFFFFF]/40  justify-center items-center h-[90%] rounded-md  p-4 font-jetbrains flex flex-col  gap-y-2" onSubmit={handleSubmit}>
          <h1 className='font-Hanken font-bold text-3xl'>Post Hackathon</h1>
          <div className="flex flex-col gap-2 w-full">
            <div className='flex flex-col gap-1'>
              <label htmlFor="name" className='font-jetbrains text-xs'>Hackathon Name</label>
              <input
                className='border-2 p-2 border-blue-300'
                type="text"
                name="name"
                placeholder="Hackathon Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className='flex flex-col gap-1'>
              <label htmlFor="website" className='font-jetbrains text-xs'>website</label>
              <input
                className='outline-1 border-2 p-2 border-blue-300'
                type="url"
                name="website"
                placeholder="website"
                value={formData.website}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex w-full gap-1">
            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor="startDate" className='font-jetbrains text-xs'>Start Date</label>
              <input
                className='border-2 w-full p-2 border-blue-300'
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>

            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor="endDate" className='font-jetbrains text-xs'>End Date</label>
              <input
                className='border-2 w-full p-2 border-blue-300'
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex w-full gap-x-1 border-black">
            <div className='flex flex-col gap-1 min-w-0 flex-1'>
              <label htmlFor="Location" className='font-jetbrains text-xs'>Location</label>
              <input
                className='border-2 min-w-0 flex-1 p-2 border-blue-300'
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className='flex flex-col gap-1 min-w-0 flex-1'>
              <label htmlFor="teamSize" className='font-jetbrains text-xs'>Team Size</label>
              <input
                className='border-2 min-w-0 flex-1 p-2 border-blue-300'
                type="number"
                name="teamSize"
                placeholder="Team Size"
                value={formData.teamSize}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className='flex flex-col gap-1 w-full'>
            <label htmlFor="description" className='font-jetbrains text-xs'>Description</label>
            <textarea
              className='p-2 border-blue-300 w-full'
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className='flex flex-col gap-1 w-full'>
            <label htmlFor="tracks" className='font-jetbrains text-xs'>Tracks</label>
            <input
              className='border-2 p-2 border-blue-300'
              type="text"
              name="tracks"
              placeholder="Tracks (AI, Web, Blockchain...)"
              value={formData.tracks}
              onChange={handleChange}
            />
          </div>

          <button className="bg-primary py-3 px-4  rounded-md " type="submit">Submit</button>
        </form>
      </div>

    </div>
  )
}

export default PostComponent
import { Share2, User } from 'lucide-react'
import React from 'react'
import hack_service from '../Api/hackathonService';
import { useNavigate } from 'react-router-dom';

const PostComponent = () => {
  const navigation = useNavigate()
  const [formData, setFormData] = React.useState({
    "name": "",
    "website": "",
    "startDate": "",
    "endDate": "",
    "location": "",
    "teamSize": "",
    "description": "",
    "tracks": "",
    "registrationFee": "",
    "registrationDeadline": ""
  })
  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      res = await hack_service.post_hackathon(formData);

      navigation('/hackathon')

    } catch (error) {
      console.log(error.errors)
      navigation('/hackathon')
    }
  }

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.2),_transparent_35%),linear-gradient(135deg,_#eef2ff_0%,_#f8fafc_50%,_#e0e7ff_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 shadow-[0_25px_80px_rgba(15,23,42,0.14)] backdrop-blur-xl lg:flex-row">
        <div className="flex flex-1 flex-col justify-between bg-gradient-to-br from-[#4f46e5] via-[#6366f1] to-[#8b5cf6] p-6 text-white sm:p-8 lg:p-10">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-white/70">Hackathon Hub</p>
            <h2 className="text-2xl font-semibold sm:text-3xl">Host your next big event</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/90 sm:text-base">
              Create a polished event listing with all the key information participants need.
            </p>
          </div>
        </div>

        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <form className="[&_*input]:rounded-xl [&_*input]:border [&_*input]:border-slate-200 [&_*input]:bg-slate-50 [&_*input]:px-4 [&_*input]:py-3 [&_*input]:text-sm [&_*input]:text-slate-700 [&_*input]:shadow-sm [&_*input]:outline-none [&_*input]:transition [&_*input]:focus:border-indigo-400 [&_*input]:focus:bg-white [&_*input]:focus:ring-2 [&_*input]:focus:ring-indigo-100 [&_*textarea]:min-h-[120px] w-full rounded-[1.5rem] border border-slate-200/80 bg-white/90 p-4 shadow-inner sm:p-6 lg:p-8" onSubmit={handleSubmit}>
            <div className="mb-2">
              <h1 className="text-3xl font-bold text-slate-800">Post Hackathon</h1>
              <p className="mt-1 text-sm text-slate-500">Fill in the details to publish your hackathon beautifully.</p>
            </div>
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
            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor="registrationFee" className='font-jetbrains text-xs'>registrationFee</label>
              <input
                className='border-2 p-2 border-blue-300'
                type="text"
                name="registrationFee"
                placeholder="registrationFee"
                value={formData.registrationFee}
                onChange={handleChange}
              />
            </div>

            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor="registrationDeadline" className='font-jetbrains text-xs'>registrationDeadline</label>
              <input
                className='border-2 w-full p-2 border-blue-300'
                type="date"
                name="registrationDeadline"
                value={formData.registrationDeadline}
                onChange={handleChange}
              />
            </div>
<div className="flex items-center justify-center w-full border mt-3">
            <button className="bg-primary py-3 px-4  rounded-md w-[80%] " type="submit">Submit</button></div>
          </form>
        </div>

      </div>
      </div>
      )
};

      export default PostComponent;
import { User, Code2 as Github, Link2 as Linkedin, Mail, Save, X } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import userService from '../Api/userService' // adjust path if userService lives elsewhere
import { login } from '../Redux/AuthSlice' // adjust path if AuthSlice lives elsewhere

const ProfileEdit = () => {
    const user = useSelector((state) => state.auth.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        profilePicture: user?.profilePicture || '',
        linkedin: user?.linkedin || '',
        github: user?.github || '',
    })

    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        setError(null)

        try {
            const updatedUser = await userService.updateProfile(form)
            dispatch(login(updatedUser))
            navigate('/')
        } catch (err) {
            // userService re-throws the backend payload directly (err.errors / err.message)
            const message =
                err.errors?.join(', ') ||
                err.message ||
                'Something went wrong. Try again.'
            setError(message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="w-full h-full flex flex-col items-center py-8">
            <form
                onSubmit={handleSubmit}
                className="w-[90%] max-w-lg border-2 border-gray-300 rounded-md p-8 flex flex-col gap-y-5"
            >
                <div className="flex justify-between items-center">
                    <h1 className="font-bold text-lg">Edit profile</h1>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* avatar preview */}
                <div className="flex items-center gap-x-4">
                    <div className="rounded-full w-16 h-16 border-2 border-gray-300 flex justify-center items-center overflow-hidden shrink-0">
                        {form.profilePicture ? (
                            <img src={form.profilePicture} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <User />
                        )}
                    </div>
                    <div className="flex flex-col gap-y-1 flex-1">
                        <label className="text-xs font-jetbrains text-gray-500">Profile picture URL</label>
                        <input
                            type="text"
                            name="profilePicture"
                            value={form.profilePicture}
                            onChange={handleChange}
                            placeholder="https://..."
                            className="border-2 border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-primary"
                        />
                    </div>
                </div>

                {/* name */}
                <div className="flex flex-col gap-y-1">
                    <label className="text-xs font-jetbrains text-gray-500">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="border-2 border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                </div>

                {/* email */}
                <div className="flex flex-col gap-y-1">
                    <label className="text-xs font-jetbrains text-gray-500 flex items-center gap-x-1">
                        <Mail size={12} /> Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="border-2 border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                </div>

                {/* github */}
                <div className="flex flex-col gap-y-1">
                    <label className="text-xs font-jetbrains text-gray-500 flex items-center gap-x-1">
                        <Github size={12} /> GitHub
                    </label>
                    <input
                        type="text"
                        name="github"
                        value={form.github}
                        onChange={handleChange}
                        placeholder="https://github.com/username"
                        className="border-2 border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                </div>

                {/* linkedin */}
                <div className="flex flex-col gap-y-1">
                    <label className="text-xs font-jetbrains text-gray-500 flex items-center gap-x-1">
                        <Linkedin size={12} /> LinkedIn
                    </label>
                    <input
                        type="text"
                        name="linkedin"
                        value={form.linkedin}
                        onChange={handleChange}
                        placeholder="https://linkedin.com/in/username"
                        className="border-2 border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <div className="flex gap-x-3 justify-end pt-2">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-4 py-1.5 rounded-md border-2 border-gray-300 text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-primary text-white px-4 py-1.5 rounded-md text-sm flex items-center gap-x-1.5 disabled:opacity-60"
                    >
                        <Save size={14} />
                        {saving ? 'Saving…' : 'Save changes'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ProfileEdit
import { Share2, User, Calendar, MapPin, Users, Globe, Trophy, DollarSign, Clock, FileText, Tags } from 'lucide-react'
import { useEffect, useState } from 'react'
import hack_service from '../Api/hackathonService';
import { useNavigate } from 'react-router-dom';

const inputBase =
  "mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-sm text-slate-700 transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:outline-none";

const labelBase = "flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500";

const Field = ({ icon: Icon, label, children }) => (
  <div>
    <label className={labelBase}>
      <Icon size={12} className="text-indigo-500" />
      {label}
    </label>
    <div className="relative">
      <Icon size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      {children}
    </div>
  </div>
);

const PostComponent = ({ data = null }) => {
const [isUpdate, setIsUpdate] = useState(false)
  const navigation = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    startDate: "",
    endDate: "",
    location: "",
    teamSize: "",
    description: "",
    tracks: "",
    registrationFee: "",
    registrationDeadline: "",
    prizePool: ""
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d)) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  useEffect(() => {
    if (data) {
      setIsUpdate(true)

      setFormData({
        ...data,
        startDate: formatDate(data.startDate),
        endDate: formatDate(data.endDate),
        registrationDeadline: formatDate(data.registrationDeadline),
      });
    }
  }, [data]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await hack_service.post_hackathon(formData);
      navigation('/hackathon');
    } catch (error) {
      console.log(error?.errors);
      navigation('/hackathon');
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      const res = await hack_service.updateHackathon(data?._id,formData);
      // navigation(`/hackathon/${data?._id}`);
    } catch (error) {
      console.log(error?.errors);
      // navigation('/hackathon');
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 p-3">
      <div className="flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/60 bg-white/90 shadow-2xl backdrop-blur-sm" style={{ maxHeight: '96vh' }}>

        {/* Header */}
        <div className="relative flex items-center justify-between overflow-hidden bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 px-6 py-4">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
          <div className="absolute -bottom-8 right-16 h-16 w-16 rounded-full bg-white/10" />
          <div className="relative">
            <h1 className="text-xl font-bold text-white sm:text-2xl">{
              isUpdate?("🚀 Update Details"):("🚀 Post a Hackathon")
              }</h1>
            <p className="mt-0.5 text-xs text-indigo-100">Fill in the details to publish it in seconds</p>
          </div>
          <button
            type="button"
            className="relative rounded-full bg-white/15 p-2 text-white hover:bg-white/25"
            title="Share"
          >
            <Share2 size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={isUpdate ? handleUpdate : handleSubmit} className="flex-1 space-y-3 overflow-y-auto px-6 py-4">

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field icon={User} label="Hackathon Name">
              <input className={inputBase} type="text" name="name" placeholder="e.g. HackFlow 2026"
                value={formData.name} onChange={handleChange} />
            </Field>

            <Field icon={Globe} label="Website">
              <input className={inputBase} type="url" name="website" placeholder="https://example.com"
                value={formData.website} onChange={handleChange} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Field icon={Calendar} label="Start Date">
              <input className={inputBase} type="date" name="startDate"
                value={formData.startDate} onChange={handleChange} />
            </Field>

            <Field icon={Calendar} label="End Date">
              <input className={inputBase} type="date" name="endDate"
                value={formData.endDate} onChange={handleChange} />
            </Field>

            <Field icon={MapPin} label="Location">
              <input className={inputBase} type="text" name="location" placeholder="City, Country"
                value={formData.location} onChange={handleChange} />
            </Field>

            <Field icon={Users} label="Team Size">
              <input className={inputBase} type="number" name="teamSize" placeholder="4"
                value={formData.teamSize} onChange={handleChange} />
            </Field>
          </div>

          <Field icon={FileText} label="Description">
            <textarea
              className="mt-1 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 pl-9 text-sm text-slate-700 transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:outline-none"
              name="description"
              placeholder="Describe your hackathon..."
              rows="2"
              value={formData.description}
              onChange={handleChange}
            />
          </Field>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field icon={Tags} label="Tracks">
              <input className={inputBase} type="text" name="tracks" placeholder="AI, Web, Blockchain..."
                value={formData.tracks} onChange={handleChange} />
            </Field>

            <Field icon={Clock} label="Registration Deadline">
              <input className={inputBase} type="date" name="registrationDeadline"
                value={formData.registrationDeadline} onChange={handleChange} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field icon={DollarSign} label="Registration Fee">
              <input className={inputBase} type="text" name="registrationFee" placeholder="$0 or Free"
                value={formData.registrationFee} onChange={handleChange} />
            </Field>

            <Field icon={Trophy} label="Prize Pool">
              <input className={inputBase} type="number" name="prizePool" placeholder="0"
                value={formData.prizePool} onChange={handleChange} />
            </Field>
          </div>

          <button
            className="mt-1 w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 font-semibold text-white shadow-md transition hover:shadow-lg hover:brightness-110 active:scale-[0.99]"
        type='submit'
          >
           {
              isUpdate?(" Update "):("Publish")
              }
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostComponent;
import mongoose from "mongoose";

const hackathonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    website: {
      type: String,
      required: true,
      trim: true,
    },

    registrationLink: {
      type: String,
      trim: true,
    },

    registrationDeadline: {
      type: Date,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    mode: {
      type: String,
      enum: ["Online", "Offline", "Hybrid"],
      default: "Online",
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    tracks: [
      {
        type: String,
        trim: true,
      },
    ],

    teamSize: {
      type: Number,
      required: true,
      min: 1,
    },

    prizePool: {
      type: Number,
      default: 0,
      min: 0,
    },

    registrationFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    banner: {
      type: String,
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    teams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
      },
    ],

    status: {
      type: String,
      enum: ["Upcoming", "Ongoing", "Completed"],
      default: "Upcoming",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Hackathon", hackathonSchema);
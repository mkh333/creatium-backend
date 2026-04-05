import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    firstname: {
        type: String,
        required: true
    },

    lastname: {
        type: String,
        required: true
    },
    
    profession: {
        type: String,
        required: true
    },

    email: {
        type: String
    },
    
    about: {
        type: String,
        required: true
    },

    skills: {
        type: [String],
        required: true
    },

    projects: [
        {
            name: { type: String },
            description: { type: String }
        }
    ],

    education: [
        {
            institution: { type: String },
            type: { type: String },
            faculty: { type: String },
            degree: { type: String },
            startDate: { type: String },
            endDate: { type: String },
        }
    ],

    experience: [
        {
            company: { type: String },
            position: { type: String },
            startDate: { type: String },
            endDate: { type: String },
            description: { type: String }
        }
    ],

    phone: {
        type: String
    },

    linkedin: {
        type: String
    },

    github: {
        type: String
    },

    avatar: {
        type: String
    }

}, {
  timestamps: true
});

export default mongoose.model("Portfolio", portfolioSchema);

const mongoose = require("mongoose");

const JobSchema = mongoose.Schema(
  {
    company: {
      type: String,
      maxlength: 50,
      required: [true, "Please provide the name of the company"],
    },
    position: {
      type: String,
      maxlength: 50,
      required: [true, "Please provide the position"],
    },
    status: {
      type: String,
      enum: ["interview", "pending", "declined"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      require: [true, "Please provide the User"],
    },
  },
  { timestamps: true }
);

// Timestamps - createdAt, updatedAt

const Job = mongoose.model("Job", JobSchema);

module.exports = Job;

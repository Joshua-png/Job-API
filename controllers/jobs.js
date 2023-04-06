const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

async function getAllJobs(req, res) {
  const { userId } = req.user;
  const jobs = await Job.find({ createdBy: userId }).sort("-createdAt");
  res.status(StatusCodes.OK).json({ jobs, nbHit: jobs.length });
}

async function getJob(req, res) {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findById({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError(`Job with id: ${jobId} not found`);
  }

  res.status(StatusCodes.OK).json({ job });
}

async function createJob(req, res) {
  const {
    body,
    user: { userId },
  } = req;

  body.createdBy = userId;
  const job = await Job.create(body);
  res.status(StatusCodes.CREATED).json({ job });
}

async function updateJob(req, res) {
  const {
    params: { id: jobId },
    user: { userId },
    body: { company, position },
  } = req;

  // When the company or position is ommitted "I dont mean empty string" the document is still updated
  if (company === "" || position === "") {
    throw new BadRequestError("Company or Position cannot be empty");
  }

  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!job) {
    throw new NotFoundError(`Job with id: ${jobId} not found`);
  }

  res.status(StatusCodes.OK).json({ job });
}

async function deleteJob(req, res) {
  const {
    params: { id: jobId },
    user: { userId },
  } = req;

  const job = await Job.findByIdAndDelete({ _id: jobId, createdBy: userId });

  if (!job) {
    throw new NotFoundError(`Job with id ${jobId} not found.`);
  }

  res.status(StatusCodes.OK).send();
}

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};

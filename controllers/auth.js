const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
// const bcrypt = require("bcryptjs");
const { BadRequestError, UnauthenticatedError } = require("../errors");
// const jwt = require("jsonwebtoken");

async function login(req, res) {
  // console.log(req);
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide the email and password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Please enter a correct email and password");
  }

  // const isPassword = await bcrypt.compare(password, user.password);
  const isPasswordCorrect = user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Please enter a correct email and password");
  }

  // const token = jwt.sign({ userId: user._id, user: user.name }, "SecretKey", {
  //   expiresIn: "30d",
  // });
  const token = await user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
}

async function register(req, res) {
  // const { password } = req.body;

  // const salt = await bcrypt.genSalt(10); // 10 default (number of rounds)
  // const hashedPassword = await bcrypt.hash(password, salt);

  // tempUser = { name, email, password: hashedPassword };
  // req.body.password = hashedPassword;

  const user = await User.create(req.body);
  // const user = await User.create({...req.body});

  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
}

module.exports = {
  login,
  register,
};

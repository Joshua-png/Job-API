const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    maxlength: 100,
    minlength: 3,
  },
  email: {
    type: String,
    required: [true, "Please e  nter your Email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Invalid Email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Enter password"],
    minlength: 6,
  },
});

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10); // 10 default (number of rounds)
  const hashedPassword = await bcrypt.hash(this.password, salt);

  this.password = hashedPassword;
  next();
});

UserSchema.methods.createJWT = function () {
  const token = jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION }
  );

  return token;
};

UserSchema.methods.comparePassword = function (password) {
  const isPasswordCorrect = bcrypt.compare(password.toString(), this.password);

  return isPasswordCorrect;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;

const mongoose = require("mongoose")
const { Schema } = mongoose
const { isEmail, isStrongPassword } = require("validator")
const bycrypt = require("bcrypt")

const usersSchema = new Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    validate: [isStrongPassword, "Weak password!!!"],
  },
})

usersSchema.pre("save", async function (next) {
  const salt = await bycrypt.genSalt()
  this.password = await bycrypt.hash(this.password, salt)
  // console.log("this is ", this)
  next()
})

usersSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email })
  if (user) {
    const auth = await bycrypt.compare(password, user.password)
    if (auth) {
      return user
    }
    throw Error("Incorrect password")
  }
  throw Error("Incorrect email")
}

module.exports = mongoose.model("users", usersSchema)

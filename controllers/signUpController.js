const Users = require("../users.model")

const handleError = (err) => {
  console.log(err.message)
  let errors = { email: "", password: "" }

  if (err.code === 11000) {
    errors.email = "That email is already registered"
  }
  if (err.message.includes("users validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message
    })
  }

  return errors
}

const signUp = async (req, res, next) => {
  const { email, password } = req.body

  try {
    await Users.create({
      email: email,
      password: password,
    })
    res.status(200).json({ signedUp: true })
  } catch (err) {
    const errors = handleError(err)
    res.status(400).json({ errors })
  }
}

module.exports = signUp

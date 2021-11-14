const Users = require("../users.model")

const handleError = (err) => {
  let errors = { email: "", password: "" }

  //incorrect email
  if (err.message === "Incorrect email") {
    errors.email = "this email is not registered"
  }
  if (err.message === "Incorrect password") {
    errors.password = "password is incorrect"
  }

  return errors
}

const login = async (req, res, next) => {
  const {
    userData: { email, password },
  } = req.body
  try {
    const user = await Users.login(email, password)
    req.session.user = { email: user.email, isLoggedIn: true }
    res.status(200).json({ user: { email: user.email, isLoggedIn: true } })
  } catch (err) {
    const errors = handleError(err)
    res.status(404).json({ errors })
  }
}

module.exports = login

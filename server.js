const express = require("express")
const app = express()
const cors = require("cors")
const dotenv = require("dotenv").config()
const session = require("express-session")
const cookieParser = require("cookie-parser")
require("./connectDb")()

//environment variables
const {
  SESS_NAME,
  SESS_SECRET,
  SESS_LIFETIME,
  NODE_ENV,
  PORT,
  MONGODB_URI,
  DB_NAME,
} = process.env

//session middleware
app.use(
  session({
    name: SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESS_SECRET,
    unset: "destroy",
    // store: MongoStore.create({
    //   dbName: DB_NAME,
    //   mongoUrl: MONGODB_URI,
    // collectionName: "sessions",
    // }),
    cookie: {
      maxAge: parseInt(SESS_LIFETIME),
      httpOnly: false,
      // secure: NODE_ENV !== "production",
    },
  })
)

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
    methods: ["GET,POST"],
  })
)
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.get("/", (req, res, next) => {
  const { user } = req.session
  if (!user) {
    return res.json({ user: { email: null, isLoggedIn: false } })
  }

  res.json({ user })
})

app.post("/login", require("./controllers/loginController"))

app.post("/signUp", require("./controllers/signUpController"))

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("there was an error trying to log out")
    } else {
      res.json({
        user: {
          email: null,
          isLoggedIn: false,
        },
      })
    }
  })
})

app.listen(PORT, () => console.log("server is running on port 5000"))

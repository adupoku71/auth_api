const mongoose = require("mongoose")

const { MONGODB_URI, DB_NAME } = process.env
//connect to db
const connect = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME,
    })
    console.log("connected to database: " + DB_NAME)
  } catch (error) {
    console.log("there was an error connecting", error)
  }
}

module.exports = connect

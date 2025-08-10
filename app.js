const express = require("express");
const mongoose = require("mongoose")
const path = require("path")
const authroute = require("./routes/authroutes")
const userroutes = require("./routes/userroutes")

require("dotenv").config()
const app = express();

const PORT =  3001

MONGO_URI ="mongodb+srv://saffaralireza99:09305006886aA@cluster0.d5stjey.mongodb.net/"

app.use(express.json())
app.use(express.static("./public"))



// app.get("/users/search", (req, res) => {
//     res.sendFile(path.join(__dirname, "views", "search.html"))
// })

app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "signup.html"))
})

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "login.html"))
})

app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "dashbord.html"))
})

// app.get("/users/chatroom", (req, res) => {
//     res.sendFile(path.join(__dirname, "views", "chatroom.html"))
// })

// app.get("/users/user", (req, res) => {
//     res.sendFile(path.join(__dirname, "views", "user.html"))
// })

// app.get("/users/settings", (req, res) => {
//     res.sendFile(path.join(__dirname, "views", "setting.html"))
// })

// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "views", "login.html"))
// })


app.use("/api/auth",authroute)

 app.use("/api/user",userroutes)

const connectDB = (url) => {
    return mongoose.connect(url);
}
const start = async () => {
    try {
        await connectDB(MONGO_URI);
        app.listen(PORT, () => console.log("listening..."))
    } catch (err) {
        console.log(err)
    }
}

start()
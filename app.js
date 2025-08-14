const express = require("express");
const mongoose = require("mongoose")
const path = require("path")
const multer = require("multer")
const authroute = require("./routes/authroutes")
const userroutes = require("./routes/userroutes")
const customerauthenticate = require("./middleware/customermiddleware")
const userController = require("./controlers/usercontroler");


require("dotenv").config()
const app = express();

const PORT =  3001

MONGO_URI ="mongodb+srv://saffaralireza99:09305006886aA@cluster0.d5stjey.mongodb.net/"

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// ===== Middleware =====
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static("./public"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"))
})

app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "signup.html"))
})

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "login.html"))
})

app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "dashbord.html"))
})

app.get("/technicians", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "find-technician.html"))
})

app.get("/technician-profile", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "technician-profile.html"))
})

app.get("/new-request", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "new-request.html"))
})

app.get("/requests", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "myrequests.html"))
})

app.get("/available-jobs", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "available-jobs.html"))
})

app.get("/request-detail", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "request-detail.html"))
})

app.get("/payment", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "payment.html"))
})


app.get("/appointments", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "appointments.html"))
})

app.get("/aboutus", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "aboutus.html"))
})



// app.use("/api/auth",authroute)

// app.use("/api/user",userroutes)


app.use("/api/auth", express.json({ limit: "10mb" }), express.urlencoded({ extended: true, limit: "10mb" }), authroute);
app.use("/api/user", express.json({ limit: "10mb" }), express.urlencoded({ extended: true, limit: "10mb" }), userroutes);

app.post(
    "/api/request", 
    customerauthenticate,
    upload.array("images", 5),
    userController.newrequest
);


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
const express = require("express")
const app = express();
const mongoose = require("mongoose");
const User = require("./models/User.js");
const methodOverride = require("method-override");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
require("dotenv").config();
const flash = require("connect-flash");
const ejsMate = require("ejs-mate");
const PORT = process.env.PORT || 8080;


const userRoutes = require("./routes/userRoutes.js");
const recordRoutes = require("./routes/recordRoutes.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.user = req.user;
    next();
});
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(methodOverride("_method"));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


main()
    .then(() => {
        console.log("connection successful")
    })
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect(process.env.MONGO_URL);
}

app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

app.use("/api", userRoutes);
app.use("/api", recordRoutes);

app.get("/" , (req,res) => {
    res.redirect("/api/login");
})

app.listen(PORT, () => {
    console.log(`server running at port ${PORT}`);
});
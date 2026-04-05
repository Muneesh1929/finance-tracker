const express = require("express");
const router = express.Router();
const User = require("../models/User.js")
const { isAdmin, isAnalyst, isViewer, isLoggedIn } = require("../middleware/roleMiddleware");
const passport = require("passport");

router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const newUser = new User({
            name,
            email,
            username: email 
        });
        const registeredUser = await User.register(newUser, password);
        res.redirect("/api/login");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post("/login", passport.authenticate("local",{failureRedirect: "/api/login"}),(req, res) => {
        res.redirect("/api/dashboard");
    }
);

router.get("/signup" , (req , res) => {
    res.render("signup");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/logout", (req, res, next) => {
    req.logout(function(err) {
        if (err) return next(err);
        req.flash("success", "Logged out successfully");
        res.redirect("/api/login");
    });
});

router.get("/users", isLoggedIn, isAdmin, async (req, res) => {
    try {
        const users = await User.find({
            _id: { $ne: req.user._id } 
        });

        res.render("users", { users });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

router.put("/users/:id/role", isLoggedIn, isAdmin, async (req, res) => {
    try {
        if (req.user._id.equals(req.params.id)) {
            req.flash("error", "You cannot change your own role");
            return res.redirect("/api/users");
        }
        const { role } = req.body;
        await User.findByIdAndUpdate(req.params.id, { role });
        req.flash("success", "User role updated successfully");
        res.redirect("/api/users");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.put("/users/:id/role", isLoggedIn, isAdmin, async (req, res) => {
    try {
        const { role } = req.body;

        await User.findByIdAndUpdate(req.params.id, { role });

        req.flash("success", "User role updated successfully");
        res.redirect("/api/users");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.delete("/users/:id",isLoggedIn ,isAdmin, async (req, res) => {
    try {
        const userId = req.params.id;

        const deleteUser = await User.findByIdAndDelete(userId);

        res.send(deleteUser);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
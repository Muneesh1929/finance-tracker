module.exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please login first");
    res.redirect("/api/login");
}

module.exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role == "admin") {
        return next();
    }
    req.flash("error", "You are not authorized to do this");
    return res.redirect("/api/dashboard");
};

module.exports.isAnalyst = (req, res, next) => {
    if (req.user.role === "analyst" || req.user.role === "admin") {
        return next();
    }
    req.flash("error", "Access Denied");
    return res.redirect("/api/dashboard");
}

module.exports.isViewer = (req, res, next) => {
    if (req.user) {
        return next();
    }
    req.flash("error", "Please login first");
    return res.redirect("/api/login");
};
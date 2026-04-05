const { recordSchema } = require("../utils/validation");

module.exports.validateRecord = (req, res, next) => {
    const { error } = recordSchema.validate(req.body);
    if (error) {
        req.flash("error", error.details[0].message);
        return res.redirect("/api/records/new");
    }
    next();
};
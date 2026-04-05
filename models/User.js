const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: [
            "viewer",
            "analyst",
            "admin"
        ],
        default: "viewer"
    },
    isActive: {
        type: Boolean,
        default: true
    }
})

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User" , userSchema);
module.exports = User;
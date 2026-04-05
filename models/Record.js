const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
   amount: {
    type: Number,
    required: true
   },
   type: {
    type: String,
    enum: [
        "income",
        "expense"
    ],
    required: true
   },
   category: {
    type: String,
    required:true
   },
   date: {
    type: Date,
    default: Date.now
   },
   note: {
    type: String,
   },
   createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
   }
});

const Record = mongoose.model("Record" , recordSchema);

module.exports = Record;
const express = require("express");
const router = express.Router();
const Record = require("../models/Record");
const { isViewer, isAnalyst, isAdmin, isLoggedIn } = require("../middleware/roleMiddleware");
const { validateRecord } = require("../middleware/validationMiddleware");

router.post("/records", isLoggedIn, isAdmin, validateRecord, async (req, res) => {
    try {
        const newRecord = new Record({ ...req.body, createdBy: req.user._id });
        await newRecord.save();
        res.redirect("/api/records/view");
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/records/new", isLoggedIn, isAdmin, (req, res) => {
    res.render("newRecord");
})

router.get("/records/view", isLoggedIn, isAnalyst, async (req, res) => {
    try {
        let filter = {
            createdBy: req.user._id
        };
        if (req.query.type) {
            filter.type = req.query.type;
        }
        if (req.query.category) {
            filter.category = req.query.category;
        }
        if (req.query.startDate && req.query.endDate) {
            filter.date = {
                $gte: new Date(req.query.startDate),
                $lte: new Date(req.query.endDate)
            };
        }
        const records = await Record.find(filter);
        res.render("records", { records, req });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/dashboard", isLoggedIn, async (req, res) => {
    try {
        const records = await Record.find({ createdBy: req.user._id });
        let totalIncome = 0;
        let totalExpense = 0;
        records.forEach((record) => {
            if (record.type === "income") {
                totalIncome += record.amount;
            } else {
                totalExpense += record.amount;
            }
        });
        const netBalance = totalIncome - totalExpense;
        res.render("dashboard", {
            totalIncome,
            totalExpense,
            netBalance
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.put("/records/:id", isLoggedIn, isAdmin, validateRecord, async (req, res) => {
    try {
        const recordId = req.params.id;

        const updateRecord = await Record.findByIdAndUpdate(
            recordId,
            req.body,
            { returnDocument: "after" }
        );

        res.redirect("/api/records/view");
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/records/:id/edit", isLoggedIn, isAdmin, async (req, res) => {
    try {
        const record = await Record.findById(req.params.id);
        res.render("editRecord", { record });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.delete("/records/:id", isLoggedIn, isAdmin, async (req, res) => {
    try {
        const recordId = req.params.id;
        const deleteRecord = await Record.findByIdAndDelete(
            recordId
        );
        res.redirect("/api/records/view");
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
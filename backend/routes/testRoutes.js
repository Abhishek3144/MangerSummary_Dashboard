const express = require("express");
const router = express.Router();

const ManagerSummary = require("../models/ManagerSummary");

// Add test data
router.post("/add", async (req, res) => {
  try {
    const data = new ManagerSummary(req.body);
    await data.save();
    res.json({ message: "Data added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;   
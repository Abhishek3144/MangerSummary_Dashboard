const express = require("express");
const router = express.Router();

const ManagerSummary = require("../models/ManagerSummary");
const { generateInsights } = require("../services/insightService");

router.get("/insights", async (req, res) => {
  try {
    const data = await ManagerSummary.find(); 

    const result = data
      .map(item => ({
        team: item.teamName,
        insights: generateInsights(item)
      }))
      .filter(item =>
        item.team && item.insights.length > 0
      );

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/insights", async (req, res) => {
  try {
    const { teamName, tasksCompleted, bugs, prsMerged, deployments, cycleTime } = req.body;
    const newEntry = new ManagerSummary({
      teamName, tasksCompleted, bugs, prsMerged, deployments, cycleTime
    });
    await newEntry.save();
    res.status(201).json({ message: "Entry added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

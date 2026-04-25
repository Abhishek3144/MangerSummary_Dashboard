const mongoose = require("mongoose");

const managerSummarySchema = new mongoose.Schema({
  teamName: String,
  tasksCompleted: Number,
  bugs: Number,
  prsMerged: Number,
  deployments: Number,
  cycleTime: Number
});

module.exports = mongoose.model("ManagerSummary", managerSummarySchema);
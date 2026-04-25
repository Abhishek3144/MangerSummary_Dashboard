function generateInsights(data) {
  const insights = [];

  const {
    tasksCompleted,
    bugs,
    prsMerged,
    deployments,
    cycleTime
  } = data;

  // 1. Bug Rate
  if (bugs > tasksCompleted * 0.3) {
    insights.push({
      type: "Bug Rate",
      severity: "High",
      message: "High bug rate detected",
      suggestion: "Improve testing and code reviews"
    });
  }

  // 2. Low Productivity
  if (tasksCompleted < 5) {
    insights.push({
      type: "Productivity",
      severity: "Medium",
      message: "Low task completion",
      suggestion: "Check for blockers or improve planning"
    });
  }

  // 3. Deployment Issue
  if (deployments < 2) {
    insights.push({
      type: "Deployment",
      severity: "Medium",
      message: "Low deployment frequency",
      suggestion: "Improve CI/CD pipeline"
    });
  }

  // 4. PR Efficiency
  if (prsMerged < tasksCompleted * 0.5) {
    insights.push({
      type: "PR Efficiency",
      severity: "Low",
      message: "Low PR merge rate",
      suggestion: "Speed up code reviews"
    });
  }

  // 5. Slow Delivery
  if (cycleTime > 5) {
    insights.push({
      type: "Delivery Speed",
      severity: "High",
      message: "Slow delivery speed",
      suggestion: "Break tasks into smaller chunks"
    });
  }

  if (insights.length === 0) {
    insights.push({
      type: "Status",
      severity: "Low",
      message: "All metrics look good",
      suggestion: "No action needed"
    });
  }

  return insights;
}

module.exports = { generateInsights };
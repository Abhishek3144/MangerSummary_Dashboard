const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 5000;
const mongoURL = process.env.MONGO_URL;

const testRoutes = require("./routes/testRoutes");
const insightRoutes = require("./routes/insightRoutes");

const ManagerSummary = require("./models/ManagerSummary");
const { generateInsights } = require("./services/insightService");

const app = express();

// Create HTTP server + Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", testRoutes);
app.use("/api", insightRoutes);

// MongoDB Connection
mongoose.connect(mongoURL)
  .then(() => {
    console.log("MongoDB Connected");

    //  CHANGE STREAM (REAL-TIME)
    const changeStream = mongoose.connection
      .collection("managersummaries")
      .watch();

    changeStream.on("change", async () => {
      console.log("DB Change Detected");

      const data = await ManagerSummary.find();

      const result = data
        .map(item => ({
          team: item.teamName || item.team,
          insights: generateInsights(item)
        }))
        .filter(item => item.team && item.insights.length > 0); 

      io.emit("insightsUpdated", result);
    });

  })
  .catch(err => console.log(err));

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

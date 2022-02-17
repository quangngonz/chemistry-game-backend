const express = require("express");
const fs = require("fs");
const app = express();

app.get("/", (req, res) => {
  const jsonData = fs.readFileSync("./scores.json");
  const data = JSON.parse(jsonData);
  res.status(200).send(data).end();
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});

const express = require("express");
const fs = require("fs");
const app = express();

app.get("/", (req, res) => {
  res.status(200).send("Hi").end();
});

app.get("/getScore", (req, res) => {
  const jsonData = fs.readFileSync("./scores.json");
  const data = JSON.parse(jsonData);
  res.status(200).send(data).end();
});

// recive name and score and save it to json file
app.post("/sendScore", (req, res) => {
  const jsonData = fs.readFileSync("./scores.json");
  const data = JSON.parse(jsonData);

  const name = req.body.name;
  const score = req.body.score;

  data.push({ name, score });
  fs.writeFileSync("./scores.json", JSON.stringify(data));

  res.status(200).send(data).end();
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});

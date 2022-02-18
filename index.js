const express = require("express");
const fs = require("fs");
var bodyParser = require("body-parser");

const app = express();

app.get("/", (_req, res) => {
  res.status(200).redirect("https://quangngo-chemistry.cf");
});

app.get("/getScore", (_req, res) => {
  const jsonData = fs.readFileSync("./scores.json");
  const data = JSON.parse(jsonData);

  const scores = data.scores;

  const topTeams = scores.sort(
    (a, b) => b.score - a.score || a.name.localeCompare(b.name)
  );

  data.scores = topTeams;

  res.status(200).send(data).end();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// recive name and score and save it to json file
app.post("/sendScore", (req, res) => {
  const jsonData = fs.readFileSync("./scores.json");
  const data = JSON.parse(jsonData);

  const name = req.body.name;
  const score = req.body.score;

  if (name && score) {
    data.scores.push({ name: name, score: score });
    fs.writeFileSync("./scores.json", JSON.stringify(data));
    res.status(200).end();
  } else {
    res.status(400).send("name and score are required").end();
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});

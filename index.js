const express = require("express");
const fs = require("fs");
const crypto = require("crypto");
var bodyParser = require("body-parser");
var cors = require("cors");

const app = express();

const whitelist = ["http://localhost:3000", "https://quangngo-chemistry.cf"];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

app.get("/", (_req, res) => {
  res.status(301).redirect("https://quangngo-chemistry.cf");
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
  const time = req.body.time;
  const hash = crypto.randomBytes(20).toString("hex");

  console.log({ name: name, score: score, hash: hash, time: time });

  if (name && score) {
    data.scores.push({ name: name, score: score, hash: hash, time: time });
    fs.writeFileSync("./scores.json", JSON.stringify(data));
    res
      .status(200)
      .send({ name: name, score: score, hash: hash, time: time })
      .end();
  } else {
    res
      .status(400)
      .send({ name: name, score: score, hash: hash, time: time })
      .end();
  }
});

app.delete("/deleteScore", (req, res) => {
  const jsonData = fs.readFileSync("./scores.json");
  let data = JSON.parse(jsonData);

  const hash = req.body.hash;

  const index = data.scores.findIndex((score) => score.hash === hash);
  data.scores.splice(index, 1);

  fs.writeFileSync("./scores.json", JSON.stringify(data));

  res.status(200).send(data.scores);
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

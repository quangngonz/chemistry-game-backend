// post name: Quang and score: 100 to localhost:8080/sendScore

import axios from "axios";

axios
  .post("localhost:8080/SendScore", {
    name: "Quang",
    score: 100,
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });

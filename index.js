const express = require("express");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT;

app.use(express.static("public", { extensions: ["html"] }));

app.get("/", (req, res) => {
  res.sendFile();
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

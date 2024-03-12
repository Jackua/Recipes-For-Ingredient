const express = require("express");
const zmq = require("zeromq");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

// Get data from my partner's microservice
let ingredients = null;
async function runServer() {
  const sock = new zmq.Reply();
  await sock.bind("tcp://127.0.0.1:5555");

  for await (const [msg] of sock) {
    await sock.send("Requesting Ingredients");
    ingredients = msg.toString();
    console.log("Ingredients recieved!");
  }
}
runServer();

// Send data retrieved from my partner's microservice
app.get("/microservice/ingrediet", (req, res) => {
  res.send(ingredients);
});

app.use(express.static("public", { extensions: ["html"] }));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

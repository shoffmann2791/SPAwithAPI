
require("dotenv").config();
const mongoose = require('mongoose');
const express = require("express");
mongoose.connect(process.env.DB_CONNECT);
const app = express();
const db = mongoose.connection;
const pizzas = require("./controllers/pizzas");
const orders = require("./controllers/orders");

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', console.log.bind(console, 'Successfully opened connection to Mongo!'));
//Lines Above Stay Above


const myMiddleware = (request, response, next) => {
  // do something with request and/or response

  console.log(request.method, request.path);
  next(); // tell express to move to the next middleware function
};

//Convert String JSON to JS Object
app.use(express.json());
app.use(myMiddleware);

app.use("/pizzas",pizzas);
app.use("/orders",orders);

app
  .route("/")
  .get((request, response) => {
    response.send("HELLO WORLD");
  })

  .post((request, response) => {
    response.json(request.body);
  });





app.route("/**").get((request, response) => {
  response.status(404).send("Not Found");
});




//Line below is always last
const PORT = process.env.PORT || 4040;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));


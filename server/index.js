
require("dotenv").config();
const mongoose = require('mongoose');
const express = require("express");

mongoose.connect(process.env.DB_CONNECT);
const app = express();
const db = mongoose.connection;


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
app
  .route("/")
  .get((request, response) => {
    response.send("HELLO WORLD");
  })

  .post((request, response) => {
    response.json(request.body);
  });


  const pizzaSchema = new mongoose.Schema({
    crust: String,
    cheese: String,
    sauce: String,
    toppings: [String]
  });

  const Pizza = mongoose.model('Pizza', pizzaSchema)


  app.post('/pizzas', (request, response) => {
    const newPizza = new Pizza(request.body);
    newPizza.save((err, pizza) => {
      return err ? response.sendStatus(500).json(err) : response.json(pizza)
    })
  });

  app.get('/pizzas', (request, response) => {
    Pizza.find({}, (error, data) => {
      if (error) return response.sendStatus(500).json(error)
      return response.json(data)
    });
  });

  app.get('/pizzas/:id', (request, response) => {
    Pizza.findById(request.params.id, (error, data) => {
      if (error) return response.sendStatus(500).json(error)
      return response.json(data)
    });
  });

  app.delete('/pizzas/:id', (request, response) => {
    Pizza.findByIdAndRemove(request.params.id, {}, (error, data) => {
      if (error) return response.sendStatus(500).json(error)
      return response.json(data)
    });
  });

  app.put('/pizzas/:id', (request, response) => {
    const body = request.body;
    Pizza.findByIdAndUpdate(
      request.params.id,
      { $set: {	"crust": body.crust,
        "cheese": body.cheese,
        "sauce": body.sauce,
        "toppings": body.toppings
      } },
      (error, data) => {
        if (error) return response.sendStatus(500).json(error);
        return response.json(request.body);
      }
    );
  });

app.route("/**").get((request, response) => {
  response.status(404).send("Not Found");
});




//Line below is always last
const PORT = process.env.PORT || 4040;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));


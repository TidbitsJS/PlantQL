const express = require("express");
const graphqlHTTP = require("express-graphql").graphqlHTTP;
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const schema = require("./schema/schema");

const app = express();

// allow cross-origin requests
app.use(cors());

const connectToMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Connectio to database failed");
    console.error(error);
  }
};

connectToMongo();

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(4040, () => {
  console.info("GraphQL server running on port 4040");
});

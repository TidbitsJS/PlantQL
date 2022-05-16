const graphql = require("graphql");
const _ = require("lodash");

const Plant = require("../models/plant");
const User = require("../models/user");

const { GraphQLObjectType, GraphQLString } = graphql;

const PlantType = new GraphQLObjectType({
  name: "Plant",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    scientificName: { type: GraphQLString },
    family: { type: GraphQLString },
    description: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.userId);
      },
    },
  }),
});
